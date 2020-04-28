/** ****** ORM ****** **/
import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm'
import { Length, IsNotEmpty, IsEmail } from 'class-validator'
/** ****** ENCRYPT ****** **/
import * as bcrypt from 'bcryptjs'

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
}
