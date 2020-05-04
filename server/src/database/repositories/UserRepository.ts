/** ****** ORM ****** **/
import { Repository, DeleteResult, UpdateResult } from 'typeorm'
/** ****** LODASH ****** **/
import _ from 'lodash'
/** ****** INTERNALS ****** **/
import User from '../models/User'
import { aLog } from '../../core/Log'
import BaseRepository from './BaseRepository'
import UserMoviesRepository from './UserMoviesRepository'

class UserRepository extends BaseRepository<User> {
	private static _instance: UserRepository

	public static get instance(): UserRepository {
		return (this._instance =
			this._instance != null ? this._instance : new UserRepository())
	}

	repository: Repository<User> = UserRepository.getConnection?.getRepository(User)

	async save(user: User): Promise<User> {
		return await super.save(user)
	}

	async create(user: User): Promise<User> {
		return await super.create(user)
	}

	async get(user: Partial<User>): Promise<User | undefined> {
		return await this.repository?.findOne({
			relations: ['movies'],
			where: user,
		})
	}

	// TODO: see if Partial type is possible
	async update(
		criteria: Partial<User>,
		partialEntity: Partial<User>,
	): Promise<UpdateResult> {
		return await super.update(criteria, partialEntity)
	}

	async delete(uuid: string): Promise<DeleteResult> {
		return await super.delete(uuid)
	}
}

export default UserRepository
