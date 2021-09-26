import path from 'path'

export abstract class Utilities {

    /** Returns the absolute path to files in the views folder.
    *
    *  @file    Relative path to the file, with root in views folder.
    *  @return {string} The absolute path to the file requested.
    */
    static getView(file: string): string {
        return path.resolve(__dirname + '/../views/' + file)
    }

    static log(type: string, message: any): void {
        switch (type) {
            case 'err':
                console.log('ERR:'.bgWhite.black + ' ' + message.red)
                break;
            case 'fatal':
                console.log('FATAL ERR:'.bgRed.white + ' ' + message.red)
                break;
            case 'warn':
                console.log('WARN:'.bgWhite.black + ' ' + message.yellow)
                break
            case 'note':
                console.log('NOTE:'.bgWhite.black + ' ' + message)
                break
            case 'success':
                console.log('INFO:'.bgWhite.black + ' ' + message.green);
                break
            default:
                console.log('INFO:'.bgWhite.black + ' ' + message)
                break
        }
    }
}