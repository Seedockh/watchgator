/** ****** SERVER ****** **/
import { Request, Response } from 'express'
/** ****** INTERNALS ****** **/
import { DatabaseError, EndpointAccessError } from '../../core/CustomErrors'
import UserFilmographyService from '../../services/UserFilmographyService'

class UserFilmographyController {
	static async addToCollection(req: Request, res: Response): Promise<Response> {
		const { userUuid } = req.body
		const { mediaId } = req.params
		try {
			await UserFilmographyService.addToCollection(userUuid, mediaId)
			return res
				.status(200)
				.json({ message: "Media successfully added to user's collection" })
		} catch (error) {
			if (error instanceof DatabaseError)
				return res
					.status(error.status)
					.json({ error: error.message, details: error.details })
			if (error instanceof EndpointAccessError)
				return res
					.status(error.status)
					.json({ error: { message: error.message } })
			return res.status(500).json({ error: 'Unexpected error', details: error })
		}
	}

	// TODO
	// static async getCollection(req: Request, res: Response): Promise<void> {}
}

export default UserFilmographyController
