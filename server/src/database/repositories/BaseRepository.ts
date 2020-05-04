/** ****** ORM ****** **/
import {
	getConnection,
	Connection,
	UpdateResult,
	Repository,
	DeleteResult,
	FindConditions,
	getRepository,
} from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

abstract class BaseRepository<T> {
	private static _connection: Connection

	public static get getConnection(): Connection {
		return (this._connection =
			this._connection != null ? this._connection : getConnection('main'))
	}

	repository!: Repository<T>

	async save(entity: T): Promise<T> {
		return await BaseRepository.getConnection.manager.save(entity)
	}

	async create(entity: T): Promise<T> {
		return await this.repository?.save(entity)
	}

	async get(entity: Partial<T>): Promise<T | undefined> {
		return await this.repository?.findOne(entity)
	}

	async update(
		criteria: FindConditions<T>,
		partialEntity: QueryDeepPartialEntity<T>,
	): Promise<UpdateResult> {
		return await this.repository?.update(criteria, partialEntity)
	}

	async delete(uuid: string): Promise<DeleteResult> {
		return await this.repository?.delete(uuid)
	}
}

export default BaseRepository
