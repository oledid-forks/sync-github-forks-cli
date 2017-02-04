#!/usr/bin/env node

import { Application, Options, Logger } from "sync-github-forks";
import { CliOptions } from "./cliOptions";

const options: Options = new CliOptions();
const logger = new Logger(options);

if (options.isValid() === false) {
	logger.log(`Usage: ${options.appName} [github-username] [path-to-work-directory] [github-api-key]`, null);
	process.exit(1);
}

const application = new Application(options, logger);
try {
	application.main();
}
catch (err) {
	logger.error(err);
	logger.flush();
	process.exit(1);
}
