/** ****** ORM ****** **/
import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm'
import { Length, IsNotEmpty, IsEmail } from 'class-validator'
/** ****** ENCRYPT ****** **/
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
/** ****** INTERNALS ****** **/
import S3 from '../../services/s3Services'
import IStorageService from 'src/services/IStorageService'

/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - nickname
 *          - email
 *          - password
 *        properties:
 *          nickname:
 *            type: string
 *            description: needs to be unique
 *          email:
 *            type: string
 *            format: email
 *          password:
 *            type: string
 *            format: min. 4 characters
 *        example:
 *           nickname: Luc
 *           email: luc@gmail.com
 *           password: luc1
 *      UserToSignIn:
 *        type: object
 *        required:
 *          - nickname
 *          - password
 *        properties:
 *          nickname:
 *            type: string
 *            description: needs to be unique
 *          password:
 *            type: string
 *            format: min. 4 characters
 *        example:
 *           nickname: Luc
 *           email: luc@gmail.com
 *           password: luc1
 *      ResponseUserRegistered:
 *        example:
 *           data:
 *            user:
 *              uuid: UUID
 *              nickname: Luc
 *              email: luc@gmail.com
 *              password: luc1
 *              avatar:
 *           meta:
 *            token: TOKEN
 */

@Entity()
@Unique(['nickname'])
export class User {
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

	hashPassword(): void {
		this.password = bcrypt.hashSync(this.password, 8)
	}

	checkIfUnencryptedPasswordIsValid(unencryptedPassword: string): boolean {
		return bcrypt.compareSync(unencryptedPassword, this.password)
	}

	static get storageService(): IStorageService {
		return S3
	}

	static tokenBelongsToUser(token: string, uuid: string): boolean {
		const userFromJwt = jwt.verify(token, String(process.env.SECRET)) as User
		return userFromJwt.uuid == uuid
	}
}
