import { Options } from "sync-github-forks";

export class CliOptions extends Options {
	constructor() {
		super(process.argv[2], process.argv[3], process.argv[4]);
	}
}
