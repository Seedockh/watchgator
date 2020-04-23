/** ****** LOGGERS ****** **/
import chalk from 'chalk'
import ora from 'ora'

/** * __Synchronous logger */
export const sLog = (message: string, color: string = '00adad'): void =>
	console.log(chalk.hex(`#${color}`).bold(message))

/** * __Asynchronous logger
 *    @return Ora instance
 *    doc: https://www.npmjs.com/package/ora
 **/
export const aLog = (message: string): Ora => ora(message).start()
