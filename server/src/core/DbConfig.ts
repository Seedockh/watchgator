import 'reflect-metadata'
import { User } from '../entities/User'
import * as PostgressConnectionStringParser from 'pg-connection-string'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
require('dotenv').config()

if (process.env.DB_URL == null)
	throw new Error('DB_URL is required in .env file')

const databaseUrl = String(process.env.DB_URL)

const connectionOptions = PostgressConnectionStringParser.parse(databaseUrl)

const typeOrmOptions: PostgresConnectionOptions = {
	type: 'postgres',
	host: String(connectionOptions.host),
	port:
		connectionOptions.port == null
			? 5432
			: Number.parseInt(connectionOptions.port),
	username: String(connectionOptions.user),
	password: String(connectionOptions.password),
	database: String(connectionOptions.database),
	synchronize: true,
	logging: false,
	entities: [User],
	extra: {
		ssl: process.env.DB_SSL === 'true' ? true : false,
	},
}

export default typeOrmOptions
