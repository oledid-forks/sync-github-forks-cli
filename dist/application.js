"use strict";
var Promise = require("bluebird");
var gitHubService_1 = require("./gitHubService");
var gitService_1 = require("./gitService");
var Application = (function () {
    function Application(options, logger, githubService, gitService, maxGitHubConcurrency, maxGitConcurrency) {
        if (githubService === void 0) { githubService = new gitHubService_1.GitHubService(options, logger); }
        if (gitService === void 0) { gitService = new gitService_1.GitService(options, logger); }
        if (maxGitHubConcurrency === void 0) { maxGitHubConcurrency = 3; }
        if (maxGitConcurrency === void 0) { maxGitConcurrency = Infinity; }
        this.options = options;
        this.logger = logger;
        this.githubService = githubService;
        this.gitService = gitService;
        this.maxGitHubConcurrency = maxGitHubConcurrency;
        this.maxGitConcurrency = maxGitConcurrency;
    }
    Application.prototype.main = function () {
        if (this.options.isValid() === false) {
            throw new Error("Invalid options");
        }
        this.start();
    };
    Application.prototype.start = function () {
        var _this = this;
        this.getForkedRepositories()
            .then(function (repos) { return _this.getRepositoryDetails(repos); })
            .then(function (values) { return _this.syncRepositories(values); })
            .then(function () {
            _this.logger.log("Finished", null);
            _this.logger.flush();
        })
            .catch(function (err) {
            throw Error(err);
        });
    };
    Application.prototype.getForkedRepositories = function (page, repositories) {
        var _this = this;
        if (page === void 0) { page = 1; }
        if (repositories === void 0) { repositories = new Array(); }
        this.logger.log("Looking for forked repositories at page " + page, null);
        return this.githubService.getRepos(this.options.username, page)
            .then(function (repos) {
            if (repos.length === 0) {
                return new Promise(function (resolve) {
                    resolve(repositories);
                });
            }
            for (var _i = 0, repos_1 = repos; _i < repos_1.length; _i++) {
                var repo = repos_1[_i];
                if (repo.fork === true) {
                    repositories.push(repo);
                }
            }
            return _this.getForkedRepositories(page + 1, repositories);
        });
    };
    Application.prototype.getRepositoryDetails = function (repos) {
        var _this = this;
        this.logger.log("Found " + repos.length + " forks. Fetching details...", null);
        var queue = new Array();
        var results = new Array();
        var _loop_1 = function (repo) {
            queue.push(new Promise(function (innerResolve, innerReject) {
                _this.logger.log("Fetching details for repository", repo.full_name);
                _this.githubService.getRepo(_this.options.username, repo.name)
                    .then(function (repoResult) {
                    innerResolve(repoResult);
                })
                    .catch(function (err) {
                    innerReject(err);
                });
            }));
        };
        for (var _i = 0, repos_2 = repos; _i < repos_2.length; _i++) {
            var repo = repos_2[_i];
            _loop_1(repo);
        }
        return Promise.map(queue, function (item) {
            return item;
        }, { concurrency: this.maxGitHubConcurrency });
    };
    Application.prototype.syncRepositories = function (repos) {
        var queue = new Array();
        var self = this;
        var _loop_2 = function (value) {
            queue.push(new Promise(function (resolve, reject) {
                self.syncRepository(value)
                    .then(function () {
                    resolve();
                })
                    .catch(function (err) {
                    reject(err);
                });
            }));
        };
        for (var _i = 0, repos_3 = repos; _i < repos_3.length; _i++) {
            var value = repos_3[_i];
            _loop_2(value);
        }
        return Promise.map(queue, function (item) {
            return item;
        }, { concurrency: this.maxGitConcurrency });
    };
    Application.prototype.syncRepository = function (repo) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.cloneRepository(repo.name, repo.full_name, repo.clone_url)
                .then(function () {
                return _this.gitService.setUpstream(repo.name, repo.full_name, repo.parent.clone_url);
            })
                .then(function () {
                return _this.gitService.pullUpstream(repo.name, repo.full_name, repo.default_branch);
            })
                .then(function () {
                return _this.gitService.pushOrigin(repo.name, repo.full_name, repo.default_branch);
            })
                .then(function () {
                return _this.trySyncMasterBranch(repo.name, repo.full_name, repo.default_branch);
            })
                .then(function () {
                return _this.gitService.syncTags(repo.name, repo.full_name);
            })
                .then(function () {
                resolve();
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    Application.prototype.cloneRepository = function (name, fullname, cloneUrl) {
        var _this = this;
        this.logger.log("Cloning repository " + cloneUrl, fullname);
        return new Promise(function (resolve, reject) {
            _this.gitService.clone(name, cloneUrl)
                .then(function (out) {
                resolve();
            })
                .catch(function (err) {
                if (err.toString().match(/destination path (.*) already exists and is not an empty directory/).length > 0) {
                    _this.logger.log("Repository folder already existed. Continuing.", fullname);
                    resolve();
                }
                else {
                    reject(err);
                }
            });
        });
    };
    Application.prototype.trySyncMasterBranch = function (name, fullname, branch) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (branch === "master") {
                resolve();
                return;
            }
            _this.logger.log("Trying to sync master branch", fullname);
            _this.gitService.pullUpstream(name, fullname, "master")
                .then(function () {
                return _this.gitService.pushOrigin(name, fullname, "master");
            })
                .then(function () {
                _this.logger.log("Master branch synced", fullname);
                resolve();
            })
                .catch(function (err) {
                _this.logger.log("Failed syncing master branch for repository", fullname);
                resolve();
            });
        });
    };
    return Application;
}());
exports.Application = Application;
//# sourceMappingURL=application.js.map