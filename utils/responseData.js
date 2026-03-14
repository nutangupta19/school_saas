


const multiLang = require("multi-lang")
const _ = multiLang("lang.json")

module.exports = {
  responseData: (message, result, req, success = true) => {
    const language = req.headers["language"] || "en"

    return {
      success,
      message: _(message, language) || _("SOMETHING_WENT_WRONG", language),
      results: result,
    }
  },
}