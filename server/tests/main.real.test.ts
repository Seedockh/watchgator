import server from '../src/core/ExpressServer'
import supertest from 'supertest'
import { createConnection, Connection } from 'typeorm'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import authRealTest from './routes/authRealTest'
import resolversRealTest from './controllers/graphQl/resolversRealTest'
import User from '../src/database/models/User'
import UserMovies from '../src/database/models/UserMovies'

let connection: Connection

server.setConfig()
const app: supertest.SuperTest<supertest.Test> = supertest(server.app)


describe('Tests to run sequentially in cleaned database', () => {

	it('Create connection to database (instruction - not a test)', async done => {
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

		done()
	})

	it('Reset database (instruction - not a test)', async done => {
		await connection.dropDatabase()
		await connection.close()
		await connection.connect()
		done()

	})

	authRealTest(app)

	it('Reset database (instruction - not a test)', async done => {
		await connection.dropDatabase()
		await connection.close()
		await connection.connect()
		done()

	})

	resolversRealTest(app)

	it('Close database connection (instruction - not a test)', async done => {
		await connection.close()
		done()
	})

})
