const transporter = require('../configs/mail.congif')


// ─── Generic send mail ─────────────────────────────
const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'SMS Platform <noreply@yourapp.com>',
      to,
      subject,
      html
    })
    console.log(`📧 Email sent to: ${to}`)
  } catch (err) {

    console.error('Email send error:', err.message)

  }
}
// ─── School admin welcome email ────────────────────
const sendSchoolAdminCredentials = async ({
  adminName,
  schoolName,
  email,
  password,
  loginUrl
}) => {

  const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
<h2 style="color: #2563eb;">Welcome to SMS Platform</h2>

<p>Hello <strong>${adminName}</strong>,</p>

<p>Your school <strong>${schoolName}</strong> has been registered on the SMS Platform.</p>

<p>Below are your admin login credentials:</p>

<table style="border-collapse: collapse; width: 100%;">
<tr>
<td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Login URL</td>
<td style="padding: 8px; border: 1px solid #ddd;">${loginUrl}</td>
</tr>

<tr>
<td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td>
<td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
</tr>

<tr>
<td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Password</td>
<td style="padding: 8px; border: 1px solid #ddd;">${password}</td>
</tr>
</table>

<p style="color: #ef4444; margin-top: 16px;">
⚠️ Please change your password immediately after first login.
</p>

<p>If you did not expect this email, please contact support immediately.</p>

</div>
`

  await sendEmail({
    to: email,
    subject: `Your School Admin Account - ${schoolName}`,
    html
  })

}


module.exports = {
  sendEmail,
  sendSchoolAdminCredentials
}