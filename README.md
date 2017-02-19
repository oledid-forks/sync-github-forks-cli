# sync-github-forks-cli [![Build Status](https://travis-ci.org/oledid-js/sync-github-forks-cli.svg?branch=master)](https://travis-ci.org/oledid-js/sync-github-forks-cli) [![npm](https://img.shields.io/npm/dt/sync-github-forks-cli.svg)](https://www.npmjs.com/package/sync-github-forks-cli) [![npm](https://img.shields.io/npm/v/sync-github-forks-cli.svg)](https://www.npmjs.com/package/sync-github-forks-cli)
Keeps github forks up to date using node, the github api and git.


## Requirements:
`git` must be in PATH.


## Program flow:
See [the API's readme](https://github.com/oledid-js/sync-github-forks)


## Usage:
```
npm install -g sync-github-forks-cli
sync-github-forks [github-username] [path-to-work-directory] [github-api-key]
```

### Example run:
```
sync-github-forks oledid-forks C:/temp/sync-github-forks (secret-github-api-key)
```

### Example output:
See [the API's readme](https://github.com/oledid-js/sync-github-forks)


## Related:
* [@oledid-js/sync-github-forks](https://github.com/oledid-js/sync-github-forks) - API for this module
* [@oledid-forks](https://github.com/oledid-forks) - An organization that uses this to sync its forks every day


## License:
[MIT](LICENSE)
