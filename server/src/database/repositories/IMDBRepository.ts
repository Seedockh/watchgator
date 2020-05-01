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
import { IMDBMediaImpl } from '../models/IMDBMediaImpl'
import BaseRepository from './BaseRepository'

class IMDBRepository extends BaseRepository {
	static repository: Repository<IMDBMediaImpl>

	static init(): void {
		this.repository = IMDBRepository.getConnection().getRepository(
			IMDBMediaImpl,
		)
		aLog('').succeed('IMDBMedia initialized')
	}

	static async create(media: IMDBMediaImpl): Promise<IMDBMediaImpl> {
		return await this.repository?.save(media)
	}

	static async get(
		media: FindConditions<IMDBMediaImpl>,
	): Promise<IMDBMediaImpl | undefined> {
		return await this.repository?.findOne(media)
	}

	static async getOrCreate(media: IMDBMedia): Promise<IMDBMediaImpl> {
		let _media = await this.repository?.findOne(media as IMDBMediaImpl)
		if (_media === undefined)
			_media = await IMDBRepository.create(media as IMDBMediaImpl)
		return _media
	}

	static async update(
		criteria: Partial<IMDBMediaImpl>,
		partialEntity: Partial<IMDBMediaImpl>,
	): Promise<UpdateResult> {
		return await this.repository?.update(criteria, partialEntity)
	}

	// static async delete(uuid: string): Promise<DeleteResult> {
	// 	return await this.repository?.delete(uuid)
	// }
}

export default IMDBRepository
