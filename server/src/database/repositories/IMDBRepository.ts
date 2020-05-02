/** ****** ORM ****** **/
import { Repository, DeleteResult, UpdateResult } from 'typeorm'
/** ****** INTERNALS ****** **/
import { aLog } from '../../core/Log'
import { IMDBMediaImpl } from '../models/IMDBMediaImpl'
import BaseRepository from './BaseRepository'

class IMDBRepository extends BaseRepository<IMDBMediaImpl> {
	private static _instance: IMDBRepository

	public static get instance(): IMDBRepository {
		return (this._instance =
			this._instance != null ? this._instance : new IMDBRepository())
	}

	repository!: Repository<IMDBMediaImpl>

	init(): void {
		this.repository = IMDBRepository.getConnection.getRepository(IMDBMediaImpl)
		aLog('').succeed('IMDBMedia initialized')
	}

	async create(media: IMDBMediaImpl): Promise<IMDBMediaImpl> {
		return await super.save(media)
	}

	async get(media: Partial<IMDBMediaImpl>): Promise<IMDBMediaImpl | undefined> {
		return await super.get(media)
	}

	async getOrCreate(
		media: Omit<IMDBMediaImpl, 'uuid'>,
	): Promise<IMDBMediaImpl> {
		let resMedia = await this.repository?.findOne({ id: media.id })
		if (resMedia === undefined)
			resMedia = await IMDBRepository.instance.create(
				Object.assign(new IMDBMediaImpl(), media),
			)
		return resMedia
	}

	async update(
		criteria: Partial<IMDBMediaImpl>,
		partialEntity: Partial<IMDBMediaImpl>,
	): Promise<UpdateResult> {
		return await super.update(criteria, partialEntity)
	}

	async delete(id: string): Promise<DeleteResult> {
		return await super.delete(id)
	}
}

export default IMDBRepository
