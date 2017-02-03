"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var https = require("https");
var GitHubService = (function () {
    function GitHubService(options, logger) {
        this.options = options;
        this.logger = logger;
    }
    GitHubService.prototype.getRepos = function (username, pageNumber) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var url = "/users/" + username + "/repos?page=" + pageNumber + "&per_page=30";
            _this.call(url, "GET", {}, function (result) { resolve(JSON.parse(result)); }, reject);
        });
    };
    GitHubService.prototype.getRepo = function (username, name) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var url = "/repos/" + username + "/" + name;
            _this.call(url, "GET", {}, function (result) { resolve(JSON.parse(result)); }, reject);
        });
    };
    GitHubService.prototype.call = function (url, method, parameterData, resolve, reject) {
        var options = {
            host: "api.github.com",
            port: 443,
            method: method,
            path: url,
            headers: {
                "User-Agent": this.options.appName + "/" + this.options.version + " (+" + this.options.homepage + ")",
                "Authorization": "token " + this.options.apiToken,
                "Content-Type": "application/json",
                "Accept": "application/vnd.github.v3+json"
            }
        };
        var output = "";
        var req = https.request(options, function (res) {
            res.setEncoding("utf8");
            res.on("data", function (data) {
                output += data;
            });
            res.on("end", function () {
                resolve(output);
            });
        });
        req.on("error", function (err) {
            reject(err);
        });
        req.end();
    };
    ;
    return GitHubService;
}());
exports.GitHubService = GitHubService;
var RepoResult = (function () {
    function RepoResult() {
    }
    return RepoResult;
}());
exports.RepoResult = RepoResult;
var DetailedRepoResult = (function (_super) {
    __extends(DetailedRepoResult, _super);
    function DetailedRepoResult() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DetailedRepoResult;
}(RepoResult));
exports.DetailedRepoResult = DetailedRepoResult;
//# sourceMappingURL=gitHubService.js.map