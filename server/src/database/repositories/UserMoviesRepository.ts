/** ****** ORM ****** **/
import { Repository, DeleteResult, UpdateResult } from 'typeorm'
/** ****** INTERNALS ****** **/
import { aLog } from '../../core/Log'
import UserMovies from '../models/UserMovies'
import User from '../models/User'
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

	async add(user: User, movie: IMDBMedia): Promise<UserMovies> {
		let userMovie: UserMovies = new UserMovies()
		userMovie.user = user
		userMovie.movie = movie.id!

		return await super.create(userMovie)
	}

	async getAll(user: User): Promise<UserMovies[]> {
		return await this.repository?.find({ where: user })
	}

	async get(media: Partial<UserMovies>): Promise<UserMovies | undefined> {
		return await super.get(media)
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
