/** ****** ORM ****** **/
import { Repository, DeleteResult, UpdateResult } from 'typeorm'
/** ****** INTERNALS ****** **/
import { aLog } from '../../core/Log'
import UserMovies from '../models/UserMovies'
import BaseRepository from './BaseRepository'

class UserMoviesRepository extends BaseRepository<IMDBMediaImpl> {
	private static _instance: IMDBMediaImpl

	public static get instance(): IMDBMediaImpl {
		return (this._instance =
			this._instance != null ? this._instance : new UserMoviesRepository())
	}

	repository!: Repository<IMDBMediaImpl>

	init(): void {
		this.repository = UserMoviesRepository.getConnection.getRepository(UserMovies)
		aLog('').succeed('UserMovies initialized')
	}

	async create(media: IMDBMediaImpl): Promise<IMDBMediaImpl> {
		return await super.save(media)
	}

	async get(media: Partial<IMDBMediaImpl>): Promise<IMDBMediaImpl | undefined> {
		return await super.get(media)
	}

	async getOrCreate(
		media: Omit<IMDBMediaImpl, 'uuid'>,
	): Promise<IMDBMediaImpl> {
		let resMedia = await this.repository?.findOne({ id: media.id })
		if (resMedia === undefined)
			resMedia = await UserMoviesRepository.instance.create(
				Object.assign(new UserMovies(), media),
			)
		return resMedia
	}

	async update(
		criteria: Partial<IMDBMediaImpl>,
		partialEntity: Partial<IMDBMediaImpl>,
	): Promise<UpdateResult> {
		return await super.update(criteria, partialEntity)
	}

	async delete(id: string): Promise<DeleteResult> {
		return await super.delete(id)
	}
}

export default UserMoviesRepository
