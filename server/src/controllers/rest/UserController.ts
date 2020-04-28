/** ****** SERVER ****** **/
import { Request, Response, RequestHandler } from 'express'
/** ****** INTERNALS ****** **/
import S3 from '../../services/s3Services'
import UserService from '../../services/UserService'
import { DatabaseError } from '../../core/CustomErrors'
import { User } from 'src/database/models/User'

class UserController {

	static async uploadAvatar(
		req: Request,
		res: Response<{ user: User } | { error: string }>,
	): Promise<void> {
		const imageUpload = S3.uploadImg.single('file')

		imageUpload(req, res, async (err: { message: any }) => {
			if (err) {
				console.log('ERROR in image uploading: ', err.message)

				return res.status(422).send({
					error: `Image Upload Error'${err.message}`,
				})
			}

			const { uuid } = req.body
			const avatar: string = req.file.location

			try {
				const result = await UserService.uploadAvatar(uuid, avatar)
				const userUpdated = result.data.user
				res.status(200).send({ user: userUpdated })
			} catch (error) {
				if (error instanceof DatabaseError)
					return res.status(error.status).send({ error: error.message })
				else return res.status(500).send(error)
			}
		})
	}

	static async deleteAvatar(req: Request, res: Response): Promise<Response> {
		try {
			S3.deleteImg(req.params.fileKey)
			return res.status(200).json({
				message: 'Success - Image deleted from S3 or not existing',
			})
		} catch (error) {
			if (error instanceof DatabaseError)
				return res
					.status(error.status)
					.json({ message: error.message, error: error.details })
			else return res.status(500).json({ message: 'error', error })
		}
	}
}

export default UserController
