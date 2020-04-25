import { app } from '../../src/core/ExpressServer'
import supertest from 'supertest'
import { createConnection, Connection } from 'typeorm'
import * as PostgressConnectionStringParser from 'pg-connection-string'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import { User } from '../../src/entities/User'

require('dotenv').config()

const server: supertest.SuperTest<supertest.Test> = supertest(app)
let connection: Connection

const runInCleanDb = (
	testSuite: (server: supertest.SuperTest<supertest.Test>) => void,
) => {
	describe('Run tests in cleaned database', () => {
		it('Makes a sample test', done => done())
		/*it('Reset database (instruction - not a test)', async done => {
			// Step 01: Database connection
			let typeOrmOptions: PostgresConnectionOptions

			if (process.env.DB_TEST_URL == null)
				throw new Error('DB_TEST_URL is required in .env file')

			const databaseUrl = String(process.env.DB_TEST_URL)

			const connectionOptions = PostgressConnectionStringParser.parse(
				databaseUrl,
			)

			typeOrmOptions = {
				type: 'postgres',
				host: String(connectionOptions.host),
				port:
					connectionOptions.port == null
						? 5432
						: (Number.parseInt(connectionOptions.port) as number),
				username: String(connectionOptions.user),
				password: String(connectionOptions.password),
				database: String(connectionOptions.database),
				synchronize: true,
				logging: false,
				entities: [User],
				extra: {
					ssl: process.env.DB_TEST_SSL === 'true' ? true : false,
				},
			}
			connection = await createConnection(typeOrmOptions)

			// Step 02: Drop database
			await connection.dropDatabase()
			await connection.close()

			// Step 03: ReOpen Database
			connection = await createConnection(typeOrmOptions)
			done()
		})

		// TESTS TO RUN
		testSuite(server)

		it('Close database connection (instruction - not a test)', async done => {
			await connection.close()
			done()
		})*/
	})
}

export default runInCleanDb
