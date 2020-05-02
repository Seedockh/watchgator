/** ****** ORM ****** **/
import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne } from 'typeorm'
import User from './User'

@Entity()
@Unique(['id'])
export default class UserMovies {
	@PrimaryGeneratedColumn()
	id!: number

	@ManyToOne(type => User, user => user.movies)
	user!: User

	@Column()
	movie!: string
}
