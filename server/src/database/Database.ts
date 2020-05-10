/** ****** SERVER ****** **/
import 'reflect-metadata'
/** ****** DATABASE ****** **/
import { createConnection, Connection } from 'typeorm'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
/** ****** INTERNALS ****** **/
import User from './models/User'
import UserMovies from './models/UserMovies'
import { aLog } from '../core/Log'

class Database {
	static connection: Connection
	static spinner: Ora

	static async boot(): Promise<boolean | void> {
		this.spinner = aLog('Connecting to database ...')

		if (process.env.DB_URL) {
			const options: PostgresConnectionOptions = {
				name: 'main',
				type: 'postgres',
				url: process.env.DB_URL,
				synchronize: true,
				logging: false,
				uuidExtension: 'uuid-ossp',
				entities: [User, UserMovies],
				extra: {
					ssl: {
						rejectUnauthorized: false,
					},
					keepAlive: true,
				},
			}

			return await createConnection(options)
				.then(createdConnection => {
					this.connection = createdConnection
					this.spinner.succeed('User database connected successfully')
				})
				.catch(e => {
					this.spinner.fail(`Connection error : ${e.message}`)
					return false
				})
		} else this.spinner.warn('DB_URL is required in .env file')
	}
}

export default Database
