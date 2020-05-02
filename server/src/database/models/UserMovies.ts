/** ****** ORM ****** **/
import { Entity, PrimaryGeneratedColumn, Column, Unique, Index, ManyToOne } from 'typeorm'
import User from './User'

@Entity()
@Unique(['id'])
export default class UserMovies {
	@PrimaryGeneratedColumn()
	id!: number

	@ManyToOne(type => User, (user: User) => user.movies, {
		cascade: ['remove']
	})
	user!: User

	@Column()
	movie!: string
}
