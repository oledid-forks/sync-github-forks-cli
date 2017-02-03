"use strict";
var path = require("path");
var execa = require("execa");
var GitService = (function () {
    function GitService(options, logger) {
        this.options = options;
        this.logger = logger;
    }
    GitService.prototype.clone = function (name, cloneUrl) {
        return execa("git", [
            "clone",
            cloneUrl,
            path.join(this.options.directoryPath, name)
        ]);
    };
    GitService.prototype.setUpstream = function (name, fullname, upstreamCloneUrl) {
        var _this = this;
        this.logger.log("Setting upstream for repository '" + name + "' to " + upstreamCloneUrl, fullname);
        return new Promise(function (resolve, reject) {
            var opts = {
                cwd: path.join(_this.options.directoryPath, name)
            };
            execa("git", [
                "remote",
                "remove",
                "upstream"
            ], opts)
                .catch(function (err) {
                if (!err.toString().match(/No such remote: upstream/)) {
                    throw new Error(err);
                }
            })
                .then(function () {
                return execa("git", [
                    "remote",
                    "add",
                    "upstream",
                    upstreamCloneUrl
                ], opts);
            })
                .then(function () {
                resolve();
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    GitService.prototype.pullUpstream = function (name, fullname, branch) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var opts = {
                cwd: path.join(_this.options.directoryPath, name)
            };
            _this.logger.log("Checking out " + branch, fullname);
            return execa("git", [
                "checkout",
                branch
            ], opts)
                .catch(function (err) {
                if (!err.toString().match(/A branch named '(.*)' already exists/)) {
                    throw new Error(err);
                }
            })
                .then(function () {
                _this.logger.log("Pulling upstream/" + branch, fullname);
                return execa("git", [
                    "pull",
                    "upstream",
                    branch
                ], opts);
            })
                .then(function () {
                resolve();
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    GitService.prototype.pushOrigin = function (name, fullname, branch) {
        var opts = {
            cwd: path.join(this.options.directoryPath, name)
        };
        this.logger.log("Pushing to origin/" + branch, fullname);
        return execa("git", [
            "push",
            "-u",
            "origin",
            branch
        ], opts);
    };
    GitService.prototype.syncTags = function (name, fullname) {
        var _this = this;
        var opts = {
            cwd: path.join(this.options.directoryPath, name)
        };
        return new Promise(function (resolve, reject) {
            _this.logger.log("Fetching tags from upstream", fullname);
            execa("git", [
                "fetch",
                "upstream",
                "--prune",
                "--tags"
            ], opts)
                .then(function () {
                _this.logger.log("Pushing tags to origin", fullname);
                return execa("git", [
                    "push",
                    "--tags"
                ], opts);
            })
                .then(function () {
                resolve();
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    return GitService;
}());
exports.GitService = GitService;
//# sourceMappingURL=gitService.js.map