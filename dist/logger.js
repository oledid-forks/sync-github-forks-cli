"use strict";
var fs = require("fs");
var path = require("path");
var Logger = (function () {
    function Logger(options) {
        this.options = options;
        this.logs = new Array();
        this.startDate = new Date();
    }
    Logger.prototype.log = function (message, fullname) {
        var msg = "[" + this.getTime() + "] " + message;
        if (fullname) {
            msg += " [" + fullname + "]";
        }
        console.log(msg);
        this.logs.push(msg);
    };
    Logger.prototype.error = function (message) {
        var msg = "[" + this.getTime() + "] " + message;
        console.error(msg);
        this.logs.push(msg);
    };
    Logger.prototype.flush = function () {
        this.log("Flushing log", null);
        var filename = path.join(this.options.directoryPath, this.getLogFilename());
        var _t = this;
        fs.appendFile(filename, this.logs.join("\n"), function (err) {
            if (err) {
                console.error(err);
            }
            else {
                _t.logs = new Array();
            }
        });
    };
    Logger.prototype.getTime = function (date) {
        if (date === void 0) { date = new Date(); }
        return date.toISOString().substring(0, 10) + " " + date.toTimeString().substring(0, 8);
    };
    Logger.prototype.getLogFilename = function () {
        return "log-"
            + this.getTime(this.startDate)
                .replace(/ /g, "-")
                .replace(/:/g, "-")
                .trim()
            + ".txt";
    };
    return Logger;
}());
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map