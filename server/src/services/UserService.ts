/** ****** AUTH ****** **/
import { ValidationError, validate } from 'class-validator'
/** ****** INTERNALS ****** **/
import { User } from '../database/models/User'
import UserRepository from '../database/repositories/UserRepository'
import { DatabaseError } from '../core/CustomErrors'
import { getConnection, getManager, UpdateResult, QueryFailedError } from 'typeorm'
import S3 from '../services/s3Services'

class UserService {
	static async getUser(uuid: string): Promise<UserServiceResponse> {
		const user = await UserRepository.get({ uuid })
		if (user == undefined)
			throw new DatabaseError(`User with uuid ${uuid} not found`, 404)
		return { status: 200, data: { user } }
	}

	static async deleteUser(uuid: string): Promise<boolean> {
		try{
			const res = await UserRepository.delete( uuid )
			return res.affected != 0
		}
		catch(error){return false}
	}

	/*
	Update user avatar and remove previous from AWS
	*/
	static async updateAvatar(
		uuid: string,
		avatar: string,
	): Promise<UserServiceResponse> {
		const connection = UserRepository.getConnection();
		let updatedUser: User | undefined = undefined;

		// Start sql transaction
		const queryRunner = connection.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();
		
		try{
			const initUser = await UserRepository.get({ uuid })
			if(initUser == undefined) throw new Error();

			// Set updatedUser by cloning init without any reference
			updatedUser = Object.assign({}, initUser);
			updatedUser.avatar = avatar

			// Update user in DB
			await queryRunner.manager.update(User, uuid, { avatar });
			await queryRunner.commitTransaction();
			
			// If DB operation succeeded, we delete previous avatar from AWS if exists
			const prevFileKey = S3.extractS3FileKey(initUser.avatar);
			if(prevFileKey != null) S3.deleteImg(prevFileKey)
			}
		catch(error){
			// If DB operation failed, we rollback and delete new avatar from AWS if it has been uploaded
			const updatedFileKey = S3.extractS3FileKey(avatar);
			if(updatedFileKey != null) S3.deleteImg(updatedFileKey)
			await queryRunner.rollbackTransaction();
			await queryRunner.release();
			throw new DatabaseError('Failed to update avatar', 500)
		}
		finally{
			await queryRunner.release();
			return{ status: 200, data: {user: updatedUser} }
		}
	}
}

export default UserService
