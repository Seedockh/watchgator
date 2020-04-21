import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm'
import { Length, IsNotEmpty, IsEmail } from 'class-validator'
import * as bcrypt from 'bcryptjs'

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

	hashPassword(): void {
		this.password = bcrypt.hashSync(this.password, 8)
	}

	checkIfUnencryptedPasswordIsValid(unencryptedPassword: string): boolean {
		return bcrypt.compareSync(unencryptedPassword, this.password)
	}
}
