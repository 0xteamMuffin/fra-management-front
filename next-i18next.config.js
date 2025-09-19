const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "hi", "mr", "bn", "kok", "or", "te", "ur"],
    localePath: path.resolve("./public/locales"),
  },
};
