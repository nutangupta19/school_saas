const multiLang = require('multi-lang')
const _ = multiLang('lang.json')
const jwt = require('jsonwebtoken')

module.exports = {
  responseData: (message, result, req, success) => {
    const language = req.headers['language'] ? req.headers['language'] : 'en'
    let response = {}
    response.success = success
    response.message =
      _(message, language) || _('SOMETHING_WENT_WRONG', language)

    response.results = result
    return response
  },
}
