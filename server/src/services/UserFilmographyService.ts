/** ****** INTERNALS ****** **/
import { User } from '../database/models/User'
import UserRepository from '../database/repositories/UserRepository'
import { DatabaseError, EndpointAccessError } from '../core/CustomErrors'
import { QueryFailedError, UpdateResult, Connection } from 'typeorm'
import { ValidationError } from 'class-validator'
import { transformAndValidate } from 'class-transformer-validator'
import { IMDBMediaImpl } from '../database/models/IMDBMediaImpl'
import IMDBRepository from '../database/repositories/IMDBRepository'
import IMDBDatasetService from './IMDBDatasetService'
import _ from 'lodash'

class UserFilmographyService {
	// TODO
	// static getCollection() {}

	static async addToCollection(
		userUuid: string,
		mediaId: string,
	): Promise<void> {
		if (typeof userUuid === undefined)
			throw new Error('userUuid is not defined')
		if (typeof mediaId === undefined) throw new Error('mediaId is not defined')

		const user = await UserRepository.get({ uuid: userUuid })
		if (user === undefined) throw new DatabaseError('User not found', 400)

		// @Peter TODO: See if this method could be in a service shared with MediaControllers
		const mediaToSave =
			process.env.NODE_ENV === 'production'
				? _.find(IMDBDatasetService.liveMovies.data, { id: mediaId })
				: _.find(IMDBDatasetService.sampleMovies.data, { id: mediaId })
		if (mediaToSave === undefined)
			throw new DatabaseError('Media not found', 400)

		const _media = await IMDBRepository.getOrCreate(mediaToSave)

		user.medias.push(_media) // @Peter Fails here -> cannot read push of undefined (similar to https://github.com/typeorm/typeorm/issues/163)
		// user.medias = [_media] // Ok but replaced previous media

		await UserRepository.getConnection().manager.save(user)
	}
}

export default UserFilmographyService
