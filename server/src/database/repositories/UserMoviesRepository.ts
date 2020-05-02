/** ****** ORM ****** **/
import { Repository, DeleteResult, UpdateResult } from 'typeorm'
/** ****** INTERNALS ****** **/
import { aLog } from '../../core/Log'
import UserMovies from '../models/UserMovies'
import BaseRepository from './BaseRepository'

class UserMoviesRepository extends BaseRepository<UserMovies> {
	private static _instance: UserMoviesRepository

	public static get instance(): UserMoviesRepository {
		return (this._instance =
			this._instance != null ? this._instance : new UserMoviesRepository())
	}

	repository!: Repository<UserMovies>

	init(): void {
		this.repository = UserMoviesRepository.getConnection.getRepository(UserMovies)
		aLog('').succeed('UserMovies initialized')
	}

	async create(media: UserMovies): Promise<UserMovies> {
		return await super.save(media)
	}

	async get(media: Partial<UserMovies>): Promise<UserMovies | undefined> {
		return await super.get(media)
	}

	async getOrCreate(
		media: Omit<UserMovies, 'uuid'>,
	): Promise<UserMovies> {
		let resMedia = await this.repository?.findOne({ id: media.id })
		if (resMedia === undefined)
			resMedia = await UserMoviesRepository.instance.create(
				Object.assign(new UserMovies(), media),
			)
		return resMedia
	}

	async update(
		criteria: Partial<UserMovies>,
		partialEntity: Partial<UserMovies>,
	): Promise<UpdateResult> {
		return await super.update(criteria, partialEntity)
	}

	async delete(id: string): Promise<DeleteResult> {
		return await super.delete(id)
	}
}

export default UserMoviesRepository
