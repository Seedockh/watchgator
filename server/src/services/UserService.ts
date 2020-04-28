/** ****** INTERNALS ****** **/
import { User } from '../database/models/User'
import UserRepository from '../database/repositories/UserRepository'
import { DatabaseError, EndpointAccessError } from '../core/CustomErrors'
import { QueryFailedError } from 'typeorm'
import { validate, ValidationError } from 'class-validator'

class UserService {
	static throwIfManipulateSomeoneElse(
		token: string | undefined,
		userUuid: string,
	): void {
		if (typeof token == 'undefined') throw new EndpointAccessError()
		if (!User.tokenBelongsToUser(token, userUuid))
			throw new EndpointAccessError()
	}

	static async getUser(
		token: string | undefined,
		uuid: string,
	): Promise<UserServiceResponse> {
		this.throwIfManipulateSomeoneElse(token, uuid)

		const user = await UserRepository.get({ uuid })
		if (user == undefined)
			throw new DatabaseError(`Uuid ${uuid} : user not found`, 404)
		return { status: 200, data: { user } }
	}

	static async deleteUser(
		token: string | undefined,
		uuid: string,
	): Promise<boolean> {
		this.throwIfManipulateSomeoneElse(token, uuid)

		try {
			const res = await UserRepository.delete(uuid)
			return res.affected != 0
		} catch (error) {
			return false
		}
	}

	/**
	 * Update everything from user except uuid and password
	 */
	static async updateUser(
		token: string | undefined,
		partialUser: IUser,
	): Promise<boolean> {
		const { uuid, password, ...dataToUpdate } = partialUser
		if (typeof uuid == 'undefined') return false

		this.throwIfManipulateSomeoneElse(token, uuid)

		try {
			const res = await UserRepository.update({ uuid }, { ...dataToUpdate })
			return res.affected != 0
		} catch (error) {
			if (error instanceof DatabaseError) throw error
			if (error instanceof QueryFailedError)
				throw new DatabaseError(error.message, 400, error.stack, error)
			return false
		}
	}

	/**
	 * Update user password only
	 */
	static async updateUserPwd(
		token: string | undefined,
		uuid: string,
		currentPwd: string,
		newPwd: string,
	): Promise<boolean> {
		if (typeof uuid == 'undefined') return false

		this.throwIfManipulateSomeoneElse(token, uuid)
		let userToUpdate: User | undefined
		try {
			userToUpdate = await UserRepository.get({ uuid })

			// Check provided current password
			if (!userToUpdate?.checkIfUnencryptedPasswordIsValid(currentPwd))
				throw new DatabaseError('Wrong current password', 403)

			// Prepare pwd update if well formatted
			userToUpdate.password = newPwd
			const errors: ValidationError[] = await validate(userToUpdate)
			if (errors.length > 0) {
				userToUpdate.password = currentPwd
				throw new DatabaseError(
					'Wrong format for new password',
					400,
					undefined,
					errors,
				)
			}
			userToUpdate.hashPassword()

			// Exec user update
			const res = await UserRepository.update(
				{ uuid },
				{ password: userToUpdate.password },
			)
			return res.affected != 0
		} catch (error) {
			if (error instanceof DatabaseError) throw error
			if (error instanceof QueryFailedError) {
				if (userToUpdate !== undefined) userToUpdate.password = currentPwd
				throw new DatabaseError(error.message, 400, error.stack, error)
			}
			return false
		}
	}

	/**
	Update user avatar and remove previous from AWS
	*/
	static async updateAvatar(
		token: string | undefined,
		uuid: string,
		avatar: string,
	): Promise<UserServiceResponse> {
		this.throwIfManipulateSomeoneElse(token, uuid)

		const connection = UserRepository.getConnection()
		let updatedUser: User | undefined = undefined

		// Start sql transaction
		const queryRunner = connection.createQueryRunner()
		await queryRunner.connect()
		await queryRunner.startTransaction()

		try {
			const initUser = await UserRepository.get({ uuid })
			if (initUser == undefined) throw new Error()

			// Set updatedUser by cloning init without any reference
			updatedUser = Object.assign({}, initUser)
			updatedUser.avatar = avatar

			// Update user in DB
			await queryRunner.manager.update(User, uuid, { avatar })
			await queryRunner.commitTransaction()

			// If DB operation succeeded, we delete previous avatar from AWS if exists
			const prevFileKey = User.storageService.extractFileKeyFromUrl(
				initUser.avatar,
			)
			if (prevFileKey != null) User.storageService.deleteImg(prevFileKey)
		} catch (error) {
			// If DB operation failed, we rollback and delete new avatar from AWS if it has been uploaded
			const updatedFileKey = User.storageService.extractFileKeyFromUrl(avatar)
			if (updatedFileKey != null) User.storageService.deleteImg(updatedFileKey)
			await queryRunner.rollbackTransaction()
			await queryRunner.release()
			throw new DatabaseError('Failed to update avatar', 500)
		} finally {
			await queryRunner.release()
			return { status: 200, data: { user: updatedUser } }
		}
	}

	static async deleteAvatar(
		token: string | undefined,
		uuid: string,
		fileKey: string,
	): Promise<boolean> {
		this.throwIfManipulateSomeoneElse(token, uuid)

		try {
			await UserRepository.update({ uuid }, { avatar: undefined })
			await User.storageService.deleteImg(fileKey)
			return true
		} catch (error) {
			return false
		}
	}
}

export default UserService
