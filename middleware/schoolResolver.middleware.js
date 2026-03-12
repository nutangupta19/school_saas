const mongoose = require('mongoose')
const School   = require('../central-db/models/School.model')

// ─── In-memory connection cache ─────────────────────────────────────────────
// Key  : school slug
// Value: { conn: MongooseConnection, lastUsed: timestamp }
const connectionCache = new Map()

const MAX_CACHED_CONNECTIONS = 50
const CACHE_TTL_MS           = 60 * 60 * 1000  // 1 hour

// ─── Cleanup stale / excess connections ─────────────────────────────────────
const cleanupConnections = async () => {
  const now = Date.now()

  // Sort by lastUsed ASC so we evict oldest first when over limit
  const entries = [...connectionCache.entries()].sort(
    (a, b) => a[1].lastUsed - b[1].lastUsed
  )

  for (const [slug, { conn, lastUsed }] of entries) {
    const isExpired  = now - lastUsed > CACHE_TTL_MS
    const isOverLimit = connectionCache.size > MAX_CACHED_CONNECTIONS

    if (isExpired || isOverLimit) {
      try {
        await conn.close()
        console.log(`🔌 Closed cached connection for school: ${slug}`)
      } catch (_) {
        // Ignore close errors
      }
      connectionCache.delete(slug)
    }

    // If we've brought size under limit, stop
    if (!isOverLimit) break
  }
}

// ─── Get or create connection for a school ───────────────────────────────────
const getSchoolConnection = async (slug) => {

  // 1. Return from cache if alive
  if (connectionCache.has(slug)) {
    const cached = connectionCache.get(slug)

    // readyState: 0=disconnected 1=connected 2=connecting 3=disconnecting
    if (cached.conn.readyState === 1) {
      cached.lastUsed = Date.now()  // refresh TTL
      return cached.conn
    }

    // Dead connection — remove from cache and reconnect below
    console.warn(`⚠️  Dead connection found for school: ${slug} — reconnecting`)
    connectionCache.delete(slug)
  }

  // 2. Fetch DB URI from central DB (select:false field needs explicit select)
  const school = await School.findOne({ slug, isActive: true }).select('+dbUri')

  if (!school) return null

  // 3. Create a new Mongoose connection (separate from the default connection)
  const conn = mongoose.createConnection(school.dbUri, {
    maxPoolSize:               10,
    serverSelectionTimeoutMS:  5000,
    socketTimeoutMS:           45000,
  })

  // Wait until actually connected before caching
  await conn.asPromise()

  console.log(`✅ New DB connection established for school: ${slug}`)

  // 4. Cache the connection
  connectionCache.set(slug, {
    conn,
    lastUsed: Date.now(),
  })

  // 5. Trigger cleanup if nearing limit
  if (connectionCache.size >= MAX_CACHED_CONNECTIONS * 0.8) {
    cleanupConnections().catch((err) =>
      console.error('Connection cleanup error:', err.message)
    )
  }

  return conn
}

// ─── Main middleware ─────────────────────────────────────────────────────────
const schoolResolver = async (req, res, next) => {
  try {
    // Priority 1: custom header (dev, Postman, mobile apps)
    // Priority 2: subdomain  (production: springdale.yourapp.com)
    const slugFromHeader = req.headers['x-school-slug']

    let slug = slugFromHeader

    if (!slug) {
      const host = req.headers.host || ''
      const subdomain = host.split('.')[0]

      const RESERVED = ['www', 'api', 'app', 'mail', 'localhost', 'admin']

      if (subdomain && !RESERVED.includes(subdomain)) {
        slug = subdomain
      }
    }

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: 'School could not be identified. Provide x-school-slug header or use correct subdomain.',
      })
    }

    const conn = await getSchoolConnection(slug)

    if (!conn) {
      return res.status(404).json({
        success: false,
        message: 'School not found or has been deactivated.',
      })
    }

    // Attach to request — all school route handlers use req.schoolDb
    req.schoolDb   = conn
    req.schoolSlug = slug

    next()
  } catch (err) {
    next(err)
  }
}

// ─── Evict a school's connection immediately (call on deactivate/delete) ─────
const evictSchoolConnection = async (slug) => {
  if (connectionCache.has(slug)) {
    const { conn } = connectionCache.get(slug)
    try {
      await conn.close()
    } catch (_) {}
    connectionCache.delete(slug)
    console.log(`🗑️  Evicted connection for school: ${slug}`)
  }
}

// ─── Expose cache stats (useful for a superadmin health endpoint) ─────────────
const getCacheStats = () => {
  const stats = []
  for (const [slug, { conn, lastUsed }] of connectionCache.entries()) {
    stats.push({
      slug,
      readyState: conn.readyState,
      lastUsed:   new Date(lastUsed).toISOString(),
    })
  }
  return stats
}

module.exports = { schoolResolver, evictSchoolConnection, getCacheStats }