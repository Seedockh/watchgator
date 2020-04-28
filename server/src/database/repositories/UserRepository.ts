/** ****** ORM ****** **/
import {
	getConnection,
	Repository,
	FindConditions,
	DeleteResult,
	UpdateResult,
	Connection,
} from 'typeorm'
import { QueryPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { validate, ValidationError } from 'class-validator'
/** ****** INTERNALS ****** **/
import { User } from '../models/User'
import { aLog } from '../../core/Log'
import { DatabaseError } from '../../core/CustomErrors'

class UserRepository {
	static repository: Repository<User>

	static getConnection(): Connection {
		return getConnection('main')
	}

	static init(): void {
		this.repository = getConnection('main').getRepository(User)
		aLog('').succeed('Users initialized')
	}

	static async create(user: User): Promise<User> {
		return await this.repository?.save(user)
	}

	static async get(user: FindConditions<User>): Promise<User | undefined> {
		return await this.repository?.findOne(user)
	}

	static async update(
		criteria: FindConditions<User>,
		partialEntity: QueryPartialEntity<User>,
	): Promise<UpdateResult> {
		// Simulate updated user to check if new datas are well formatted
		const user = await this.repository?.findOne(criteria)

		if (typeof user === 'undefined')
			throw new DatabaseError('User not found', 400)

		for (const key in partialEntity) {
			if (typeof partialEntity[key] !== 'undefined')
				user[key] = partialEntity[key]
		}

		// Throw if incorrect format
		user.password = 'fake' // otherwise validation test consider encrypted pwd too long
		const errors: ValidationError[] = await validate(user)
		if (errors.length > 0)
			throw new DatabaseError('Incorrect data', 400, undefined, errors)

		// Update user if correct format
		return await this.repository?.update(criteria, partialEntity)
	}

	static async delete(uuid: string): Promise<DeleteResult> {
		return await this.repository?.delete(uuid)
	}
}

export default UserRepository
