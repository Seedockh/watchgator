/** ****** ORM ****** **/
import {
	getConnection,
	Repository,
	FindConditions,
	DeleteResult,
	UpdateResult,
	Connection,
} from 'typeorm'
import { QueryPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
/** ****** INTERNALS ****** **/
import { User } from '../models/User'
import { aLog } from '../../core/Log'
import BaseRepository from './BaseRepository'

class UserRepository extends BaseRepository {
	static repository: Repository<User>

	static init(): void {
		this.repository = BaseRepository.getConnection().getRepository(User)
		aLog('').succeed('Users initialized')
	}

	static async create(user: User): Promise<User> {
		return await this.repository?.save(user)
	}

	static async get(user: FindConditions<User>): Promise<User | undefined> {
		return await this.repository?.findOne(user)
	}

	// TODO: see if Partial type is possible
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
