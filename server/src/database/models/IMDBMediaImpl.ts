/** ****** ORM ****** **/
import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm'

@Entity()
@Unique(['id'])
export class IMDBMediaImpl implements Partial<IMDBMedia> {
	@PrimaryGeneratedColumn('uuid')
	uuid!: string

	@Column({ name: 'id' })
	id!: string

	@Column({ nullable: true, name: 'title' })
	title!: string | null

	@Column({ nullable: true, name: 'year' })
	year!: number | null

	@Column({ nullable: true, name: 'rating' })
	rating!: number | null

	@Column({ nullable: true, name: 'nbRatings' })
	nbRatings!: number | null

	@Column({ nullable: true, name: 'metaScore' })
	metaScore!: number | null

	@Column({ nullable: true, name: 'certificate' })
	certificate!: string | null

	@Column({ nullable: true, name: 'runtime' })
	runtime!: number | null

	// @Column('simple-array', { nullable: true, array: true, name: 'genres' })
	// genres!: (IMDBCategory | null)[]

	@Column({ nullable: true, name: 'description' })
	description!: string | null

	@Column({ nullable: true, name: 'picture' })
	picture!: string | null

	// @Column('simple-array', { nullable: true, array: true, name: 'directors' })
	// directors!: (IMDBPerson | null)[]

	// @Column('simple-array', { nullable: true, array: true, name: 'actors' })
	// actors!: (IMDBPerson | null)[]

	@Column({ nullable: true, name: 'gross' })
	gross!: string | null
}
