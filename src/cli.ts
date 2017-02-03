#!/usr/bin/env node

import { Application } from "./application";
import { CliOptions, Options } from "./options";
import { Logger } from "./logger";

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
