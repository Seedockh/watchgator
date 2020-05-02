/** ****** INTERNALS ****** **/
import UserRepository from '../database/repositories/UserRepository'
import { DatabaseError } from '../core/CustomErrors'
import User from '../database/models/User'
import { throwIfManipulateSomeoneElse } from './utils'

class UserMoviesService {
	static async getCollection(
		token: string | undefined,
		userUuid: string,
	): Promise<User | undefined> {
		throwIfManipulateSomeoneElse(token, userUuid)

		if (typeof userUuid === undefined)
			throw new Error('userUuid is not defined')

		return await UserRepository.instance.getWithMovies(userUuid)
	}

	static async addToCollection(
		token: string | undefined,
		userUuid: string,
		mediaId: string,
	): Promise<void> {
		throwIfManipulateSomeoneElse(token, userUuid)

		if (typeof userUuid === undefined)
			throw new Error('userUuid is not defined')
		if (typeof mediaId === undefined) throw new Error('mediaId is not defined')

		const user = await UserRepository.instance.getWithMovies(userUuid)
		if (user === undefined) throw new DatabaseError('User not found', 400)

		await UserRepository.instance.pushMovie(user, mediaId)
	}
}

export default UserMoviesService
