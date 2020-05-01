/** ****** ORM ****** **/
import { getConnection, Connection } from 'typeorm'

class BaseRepository {
	static getConnection(): Connection {
		return getConnection('main')
	}
}

export default BaseRepository
