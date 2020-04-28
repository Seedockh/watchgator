/** ****** AUTH ****** **/
import { ValidationError, validate } from 'class-validator'
/** ****** INTERNALS ****** **/
import { User } from '../database/models/User'
import UserRepository from '../database/repositories/UserRepository'
import { DatabaseError } from '../core/CustomErrors'

class UserService {
	static async uploadAvatar(
		uuid: string,
		avatar: string,
	): Promise<UserServiceResponse> {
		const userToUpdate: User = new User()
		userToUpdate.avatar = avatar

		const errors: ValidationError[] = await validate(userToUpdate, {
			skipMissingProperties: true,
		})

		if (errors.length > 0) {
			throw new DatabaseError('Incorrect format of provided avatar', 415)
		}

		try {
			await UserRepository.update({ uuid }, { avatar: userToUpdate.avatar })
			const user = await UserRepository.get({ uuid })
			if (user == undefined) throw new Error()
			return {
				status: 200,
				data: { user },
			}
		} catch (exception) {
			throw new DatabaseError('Unexpected error while updating user', 500)
		}
	}
}

export default UserService
