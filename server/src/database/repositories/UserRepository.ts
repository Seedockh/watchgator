/** ****** ORM ****** **/
import { getConnection, getRepository, Repository } from 'typeorm'
/** ****** INTERNALS ****** **/
import Database from '../Database'
import { User } from '../models/User'
import { aLog } from '../../core/Log'

class UserRepository {
	static repository: Repository<User>

	static async init() {
		this.repository = getConnection('main').getRepository(User)
		aLog('').succeed('Users initialized')
	}

	static async create(user: User): Promise<User> {
		return await this.repository?.save(user)
	}

	static async get(id: any) {
		// TODO
	}

	static async update(id: any) {
		// TODO
	}

	static async delete(id: any) {
		// TODO
	}
}

export default UserRepository
