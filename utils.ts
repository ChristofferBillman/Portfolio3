import path from 'path'
import * as fs from 'fs/promises';
import os from 'os'

export abstract class Utilities {

	/** Returns the absolute path to files in the views folder.
	*
	*  @file    Relative path to the file, with root in views folder.
	*  @return {string} The absolute path to the file requested.
	*/
	static getView(file: string): string {
		return path.resolve(__dirname + '/../views/' + file)
	}
	/**
	 * Logs the input parameters in the console and in logs/log.txt.
	 * @param type		The type of messeage. Controls how the printout looks.
	 *              	Allowed values are 'err', 'fatal', 'warn', 'note' and 'success'.
	 * @param message 	The message to be logged.
	 */
	static log(type: string, message: any): void {

		fs.appendFile(__dirname + "/../logs/log.txt", this.getDateString() + '[' + type + '] ' + message + os.EOL)
			.catch(err => {
				console.log("Failed to write log. See stack trace:")
				console.log(err)
			})

		switch (type) {
			case 'err':
				console.log(this.getDateString() + 'ERR:'.bgWhite.black + ' ' + message.red)
				break;
			case 'fatal':
				console.log(this.getDateString() + 'FATAL ERR:'.bgRed.white + ' ' + message.red)
				break;
			case 'warn':
				console.log(this.getDateString() + 'WARN:'.bgWhite.black + ' ' + message.yellow)
				break
			case 'note':
				console.log(this.getDateString() + 'NOTE:'.bgWhite.black + ' ' + message)
				break
			case 'success':
				console.log(this.getDateString() + 'INFO:'.bgWhite.black + ' ' + message.green);
				break
			default:
				console.log(this.getDateString() + 'INFO:'.bgWhite.black + ' ' + message)
				break
		}
	}

	/**
	 * Gets the current time, in hours, minutes and seconds (in that order).
	 * @return The formatted time.
	 */
	static getDateString(): string {
		var d: Date = new Date()

		return '[' +
			(d.getHours() < 10 ? '0' : '') + d.getHours() + ':' +
			(d.getMinutes() < 10 ? '0' : '') + d.getMinutes() + ':' +
			(d.getSeconds() < 10 ? '0' : '') + d.getSeconds() + '] '
	}
}
