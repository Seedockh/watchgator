/** ****** ORM ****** **/
import { getConnection, Repository, FindConditions } from 'typeorm'
/** ****** INTERNALS ****** **/
import { User } from '../models/User'
import { aLog } from '../../core/Log'
import { QueryPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

class UserRepository {
	static repository: Repository<User>

	static async init() {
		this.repository = getConnection('main').getRepository(User)
		aLog('').succeed('Users initialized')
	}

	static async create(user: User): Promise<User> {
		return await this.repository?.save(user)
	}

	static async get(user: FindConditions<User>): Promise<User | undefined> {
		return await this.repository?.findOne(user)
	}

	static async update(
		criteria: FindConditions<User>,
		partialEntity: QueryPartialEntity<User>,
	) {
		return await this.repository?.update(criteria, partialEntity)
	}

	static async delete(id: any) {
		// TODO
	}
}

export default UserRepository
