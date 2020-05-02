/** ****** SERVER ****** **/
import { Request, Response } from 'express'
/** ****** INTERNALS ****** **/
import { DatabaseError, EndpointAccessError } from '../../core/CustomErrors'
import UserMoviesService from '../../services/UserMoviesService'
import { getTokenFromHeader } from './utils'

class UserMoviesController {
	static async getCollection(req: Request, res: Response): Promise<Response> {
		const { userUuid } = req.body

		try {
			const user = await UserMoviesService.getCollection(
				getTokenFromHeader(req),
				userUuid,
			)
			if (user === undefined)
				return res.status(404).json({ error: 'User not found' })
			return res.status(200).json({ data: { user } })
		} catch (error) {
			if (error instanceof EndpointAccessError)
				return res.status(403).json({ error: { message: error.message } })
			return res.status(500).json({ error: 'Unexpected error', details: error })
		}
	}

	static async addToCollection(req: Request, res: Response): Promise<Response> {
		const { userUuid } = req.body
		const { mediaId } = req.params
		try {
			await UserMoviesService.addToCollection(
				getTokenFromHeader(req),
				userUuid,
				mediaId,
			)
			return res
				.status(200)
				.json({ message: "Media successfully added to user's collection" })
		} catch (error) {
			if (error instanceof DatabaseError)
				return res
					.status(error.status)
					.json({ error: error.message, details: error.details })
			if (error instanceof EndpointAccessError)
				return res.status(403).json({ error: { message: error.message } })
			return res.status(500).json({ error: 'Unexpected error', details: error })
		}
	}
}

export default UserMoviesController
