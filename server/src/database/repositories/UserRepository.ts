/** ****** ORM ****** **/
import {
	getConnection,
	Repository,
	FindConditions,
	DeleteResult,
	UpdateResult,
	Connection,
} from 'typeorm'
/** ****** INTERNALS ****** **/
import { User } from '../models/User'
import { aLog } from '../../core/Log'
import { QueryPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

class UserRepository {
	static repository: Repository<User>

	static getConnection(): Connection {
		return getConnection('main')
	}

	static init(): void {
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
	): Promise<UpdateResult> {
		return await this.repository?.update(criteria, partialEntity)
	}

	static async delete(uuid: string): Promise<DeleteResult> {
		return await this.repository?.delete(uuid)
	}
}

export default UserRepository
