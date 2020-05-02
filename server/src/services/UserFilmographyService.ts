/** ****** INTERNALS ****** **/
import UserRepository from '../database/repositories/UserRepository'
import { DatabaseError } from '../core/CustomErrors'

class UserFilmographyService {
	// TODO
	// static getCollection() {}

	static async addToCollection(
		userUuid: string,
		mediaId: string,
	): Promise<void> {
		if (typeof userUuid === undefined)
			throw new Error('userUuid is not defined')
		if (typeof mediaId === undefined) throw new Error('mediaId is not defined')

		const user = await UserRepository.instance.getWithMedias(userUuid)
		if (user === undefined) throw new DatabaseError('User not found', 400)

		await UserRepository.instance.pushMedia(user, mediaId)
	}
}

export default UserFilmographyService
