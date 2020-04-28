/** ****** NODE ****** **/
import path from 'path'
import { existsSync } from 'fs'
import { isEmpty } from 'lodash'
/** ****** .ENV ****** **/
import { config } from 'dotenv'
/** ****** LOGGER ****** **/
import { sLog } from './core/Log'

const envPathName = path.join(process.cwd(), '.env')

// Define here every variable needed in your .env
// so that you never forget it 👀
const neededValues = [
	'PORT',
	'SECRET',
	'DB_URL',
	'AWS_S3_URL',
	'AWS_S3_SECRET_ACCESS_KEY',
	'AWS_S3_ACCESS_KEY_ID',
	'AWS_S3_REGION',
	'AWS_S3_BUCKET',
]

if (existsSync(envPathName) || process.env.NODE_ENV === 'production') {
	config()

	const missingValues = neededValues.filter(
		(v: string): boolean => !process.env[v],
	)

	if (!isEmpty(missingValues)) {
		sLog(
			`Sorry [${missingValues.join(
				'/',
			)}] value(s) are missing on your .env file`,
			'FF8800',
		)
		process.exit(42)
	}
} else {
	sLog('Sorry an .env file is missing', 'FF8800')
	process.exit(42)
}
