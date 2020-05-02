/** * ****** LODASH ****** **/
import _ from 'lodash'
/** ****** INTERNALS ****** **/
import UserRepository from '../database/repositories/UserRepository'
import UserMoviesRepository from '../database/repositories/UserMoviesRepository'
import IMDBDatasetService from './IMDBDatasetService'
import { DatabaseError } from '../core/CustomErrors'
import User from '../database/models/User'
import { throwIfManipulateSomeoneElse } from './utils'

class UserMoviesService {
	static env: string = process.env.NODE_ENV === 'production' ? 'live' : 'sample'

	static async getCollection(
		token: string | undefined,
		userUuid: string,
	): Promise<User | undefined> {
		throwIfManipulateSomeoneElse(token, userUuid)

		if (typeof userUuid === undefined)
			throw new Error('userUuid is not defined')

		return await UserRepository.instance.getWithMovies(userUuid)
	}

	static async add(
		token: string | undefined,
		uuid: string,
		movieId: string,
	): Promise<void> {
		throwIfManipulateSomeoneElse(token, uuid)

		if (typeof uuid === undefined) throw new Error('User uuid is not defined')
		if (typeof movieId === undefined) throw new Error('Movie id is not defined')

		const user = await UserRepository.instance.get({ uuid: uuid })
		if (user === undefined) throw new DatabaseError('User not found', 400)

		const movie = _.filter(
			IMDBDatasetService[`${this.env}Movies`].data,
			{ id: movieId }
		)[0]
		if (movie === undefined) throw new DatabaseError('Movie not found', 400)

		await UserMoviesRepository.instance.create(user, movie)
	}
}

export default UserMoviesService
