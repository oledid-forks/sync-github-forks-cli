"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var packageJson = require("../package.json");
var Options = (function () {
    function Options(username, directoryPath, apiToken) {
        this.username = username;
        this.directoryPath = directoryPath;
        this.apiToken = apiToken;
        this.appName = packageJson.name;
        this.version = packageJson.version;
        this.homepage = packageJson.homepage;
    }
    Options.prototype.isValid = function () {
        return !!this.username
            && this.username.length > 0
            && !!this.apiToken
            && this.apiToken.length > 0
            && !!this.directoryPath
            && this.directoryPath.length > 0;
    };
    return Options;
}());
exports.Options = Options;
var CliOptions = (function (_super) {
    __extends(CliOptions, _super);
    function CliOptions() {
        return _super.call(this, process.argv[2], process.argv[3], process.argv[4]) || this;
    }
    return CliOptions;
}(Options));
exports.CliOptions = CliOptions;
//# sourceMappingURL=options.js.map