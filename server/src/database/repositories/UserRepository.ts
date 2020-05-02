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

	repository!: Repository<User>

	init(): void {
		this.repository = UserRepository.getConnection.getRepository(User)
		aLog('').succeed('Users initialized')
	}

	async save(user: User): Promise<User> {
		return await super.save(user)
	}

	async create(user: User): Promise<User> {
		return await super.create(user)
	}

	async get(user: Partial<User>): Promise<User | undefined> {
		return await super.get(user)
	}

	async getWithMovies(userUuid: string): Promise<User | undefined> {
		return await this.repository?.findOne({
			relations: ['movies'],
			where: { uuid: userUuid },
		})
	}

	// TODO: see if Partial type is possible
	async update(
		criteria: Partial<User>,
		partialEntity: Partial<User>,
	): Promise<UpdateResult> {
		return await super.update(criteria, partialEntity)
	}

	/** Push media only if not already exists in user media collection */
	async pushMedia(user: User, mediaId: string): Promise<void> {
		const _media = await UserMoviesRepository.instance.getOrCreate({ id: mediaId })

		const unicity = _.findIndex(user.medias, med => med.id === _media.id)
		if (unicity === -1) user.medias.push(_media) // Add to prev medias

		await UserRepository.getConnection.manager.save(user)
	}

	async delete(uuid: string): Promise<DeleteResult> {
		return await super.delete(uuid)
	}
}

export default UserRepository
