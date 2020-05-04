import server from '../src/core/ExpressServer'
import supertest from 'supertest'
import { createConnection, Connection } from 'typeorm'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import User from '../src/database/models/User'
import UserMovies from '../src/database/models/UserMovies'

require('dotenv').config()

server.setConfig()
const app: supertest.SuperTest<supertest.Test> = supertest(server.app)

let connection: Connection

const runInCleanDb = (
	testSuite: (app: supertest.SuperTest<supertest.Test>) => void,
) => {
	describe('Run tests in cleaned database', () => {
		it('Reset database (instruction - not a test)', async done => {
			// Step 01: Database connection
			if (process.env.DB_TEST_URL == null)
				throw new Error('DB_TEST_URL is required in .env file')

			const options: PostgresConnectionOptions = {
				name: 'main',
				type: 'postgres',
				url: process.env.DB_TEST_URL,
				synchronize: true,
				logging: false,
				uuidExtension: 'uuid-ossp',
				entities: [User, UserMovies],
				extra: {
					ssl: process.env.DB_TEST_SSL === 'true' ? true : false,
				},
			}

			connection = await createConnection(options)

			// Step 02: Drop database
			await connection.dropDatabase()
			await connection.close()

			// Step 03: ReOpen Database
			connection = await createConnection(options)

			done()
		})

		// TESTS TO RUN
		testSuite(app)

		it('Close database connection (instruction - not a test)', async done => {
			await connection.close()
			done()
		})
	})
}

export default runInCleanDb
