/** ****** SERVER ****** **/
import { Request, Response, RequestHandler } from 'express'
/** ****** INTERNALS ****** **/
import S3 from '../../services/s3Services'
import UserService from '../../services/UserService'
import { DatabaseError } from '../../core/CustomErrors'
import { User } from 'src/database/models/User'

class UserController {

	static async updateAvatar(req: Request, res: Response<{ user: User } | { error: string, details: any }>) {

		const imageUpload = S3.uploadImg.single('file')

		imageUpload(req, res, async (err: { message: any }) => {
			if (err) {
				console.log('ERROR in image uploading: ', err.message)

				return res.status(422).send({
					error: 'Image Upload Error', details: err.message,
				})
			}

			const { uuid } = req.body
			const avatar: string = req.file.location

			try {
				const response = await UserService.updateAvatar(uuid, avatar)
				return res.status(response.status).json({ user: response.data.user })
			} catch (error) {
				if (error instanceof DatabaseError)
					return res
						.status(error.status)
						.json({ error: error.message, details: error.details })
				else return res.status(500).json({ error: 'Unexpected error', details: error })
			}
		})
	}

	static async deleteAvatar(req: Request, res: Response): Promise<Response> {
		try {
			S3.deleteImg(req.params.fileKey) // Delete from user also!!
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

	/**
	 * @swagger
	 * path:
	 *  /user/get/:userUuid:
	 *    get:
	 *      summary: Get user by uuid
	 *      tags: [Users]
	 *      parameters:
	 *        - in: path
	 *          name: uuid
	 *          description: user uuid
	 *          schema:
	 *            type: string
	 *          required: true
	 *        - in: header
	 *          name: Authorization
	 *          description: Bearer + TOKEN
	 *          schema:
	 *            type: string
	 *            format: token
	 *          required: true
	 *      responses:
	 *        "200":
	 *          description: User found
	 *          content:
	 *            application/json:
	 *              user: User
	 *        "404":
	 *          description: User cannot be found
	 *          content:
	 *            application/json:
	 *              message:
	 *        "500":
	 *          description: Unexpected error
	 *          content:
	 *            application/json:
	 *              message:
	 *              error:
	 */
	static async getUser(req: Request, res: Response) {
		try {
			const response = await UserService.getUser(req.params.uuid)
			return res.status(response.status).json({ user: response.data.user })
		} catch (error) {
			if (error instanceof DatabaseError)
				return res
					.status(error.status)
					.json({ message: error.message, error: error.details })
			else return res.status(500).json({ message: 'Unexpected error', error })
		}
	}
}

export default UserController
