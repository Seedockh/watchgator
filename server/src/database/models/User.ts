/** ****** ORM ****** **/
import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm'
import { Length, IsNotEmpty, IsEmail, ValidationSchema } from 'class-validator'
/** ****** ENCRYPT ****** **/
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
/** ****** INTERNALS ****** **/
import S3 from '../../services/s3Services'
import IStorageService from 'src/services/IStorageService'

@Entity()
@Unique(['nickname'])
export class User implements IUser {
	@PrimaryGeneratedColumn('uuid')
	uuid!: string

	@Column('text')
	@IsNotEmpty()
	nickname!: string

	@Column('text')
	@IsNotEmpty()
	@IsEmail()
	email!: string

	@Column('text')
	@Length(4, 20)
	@IsNotEmpty()
	password!: string

	@Column('text', { nullable: true })
	avatar?: string

	static hashPassword(user: User): void {
		user.password = bcrypt.hashSync(user.password, 8)
	}

	static checkIfUnencryptedPasswordIsValid(
		user: User,
		unencryptedPassword: string,
	): boolean {
		return bcrypt.compareSync(unencryptedPassword, user.password)
	}

	static get storageService(): IStorageService {
		return S3
	}

	static tokenBelongsToUser(token: string, uuid: string): boolean {
		const userFromJwt = jwt.verify(token, String(process.env.SECRET)) as User
		return userFromJwt.uuid == uuid
	}
}
