#!/usr/bin/env node
"use strict";
var application_1 = require("./application");
var options_1 = require("./options");
var logger_1 = require("./logger");
var options = new options_1.CliOptions();
var logger = new logger_1.Logger(options);
if (options.isValid() === false) {
    logger.log("Usage: " + options.appName + " [github-username] [path-to-work-directory] [github-api-key]", null);
    process.exit(1);
}
var application = new application_1.Application(options, logger);
try {
    application.main();
}
catch (err) {
    logger.error(err);
    logger.flush();
    process.exit(1);
}
//# sourceMappingURL=cli.js.map