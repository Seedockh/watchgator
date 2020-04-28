/** ****** SERVER ****** **/
import { Request, Response } from 'express'
/** ****** INTERNALS ****** **/
import UserService from '../../services/UserService'
import { DatabaseError, EndpointAccessError } from '../../core/CustomErrors'
import { User } from '../../database/models/User'
import { getTokenFromHeader } from './utils'

class UserController {

	static async updateAvatar(req: Request, res: Response): Promise<void> {
		const imageUpload = User.storageService.uploadImg.single('file')

		imageUpload(req, res, async (err: { message: any }) => {
			if (err) {
				return res.status(422).send({
					error: 'Image Upload Error',
					details: err.message,
				})
			}

			const { uuid } = req.body
			const avatar: string = req.file.location

			try {
				const response = await UserService.updateAvatar(
					getTokenFromHeader(req),
					uuid,
					avatar,
				)
				return res.status(response.status).json({ user: response.data.user })
			} catch (error) {
				if (error instanceof DatabaseError)
					return res
						.status(error.status)
						.json({ error: error.message, details: error.details })
				if (error instanceof EndpointAccessError)
					return res
						.status(error.status)
						.json({ error: { message: error.message } })
				return res
					.status(500)
					.json({ error: 'Unexpected error', details: error })
			}
		})
	}

	static async deleteAvatar(req: Request, res: Response): Promise<Response> {
		try {
			const result = await UserService.deleteAvatar(
				getTokenFromHeader(req),
				req.body.uuid,
				req.params.fileKey,
			) // TODO: Delete from user also!!
			if (!result) throw new Error()
			return res.status(200).json({
				message: 'Success - Image deleted from S3 or not existing',
			})
		} catch (error) {
			if (error instanceof DatabaseError)
				return res
					.status(error.status)
					.json({ message: error.message, error: error.details })
			if (error instanceof EndpointAccessError)
				return res
					.status(error.status)
					.json({ error: { message: error.message } })
			else return res.status(500).json({ message: 'error', error })
		}
	}

	/**
	 * @swagger
	 * path:
	 *  /user/get/:uuid:
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
	 *              schema:
	 *                type: array
	 *                $ref: '#/components/schemas/User'
	 *        "403":
	 *          description: Only operations on its own user are allowed
	 *          content:
	 *            application/json:
	 *              schema:
	 *                $ref: '#/components/schemas/ResponseUnauthorized'
	 *        "404":
	 *          description: User cannot be found
	 *          content:
	 *            application/json:
	 *              schema:
	 *                type: object
	 *                properties:
	 *                  message:
	 *                    type: string
	 *        "500":
	 *          description: Unexpected error
	 *          content:
	 *            application/json:
	 *              schema:
	 *                type: object
	 *                properties:
	 *                  message:
	 *                    type: string
	 *                  error:
	 *                    type: string
	 */
	static async getUser(req: Request, res: Response): Promise<Response> {
		try {
			const response = await UserService.getUser(
				getTokenFromHeader(req),
				req.params.uuid,
			)
			return res.status(response.status).json({ user: response.data.user })
		} catch (error) {
			if (error instanceof DatabaseError)
				return res
					.status(error.status)
					.json({ message: error.message, error: error.details })
			if (error instanceof EndpointAccessError)
				return res
					.status(error.status)
					.json({ error: { message: error.message } })
			else return res.status(500).json({ message: 'Unexpected error', error })
		}
	}

	/**
	 * @swagger
	 * path:
	 *  /user/delete/:uuid:
	 *    delete:
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
	 *              schema:
	 *                type: object
	 *                properties:
	 *                  success:
	 *                    type: string
	 *        "400":
	 *          description: Uuid required
	 *          content:
	 *            application/json:
	 *              schema:
	 *                type: object
	 *                properties:
	 *                  error:
	 *                    type: string
	 *        "403":
	 *          description: Only operations on its own user are allowed
	 *          content:
	 *            application/json:
	 *              schema:
	 *                $ref: '#/components/schemas/ResponseUnauthorized'
	 *        "500":
	 *          description: Unexpected error
	 *          content:
	 *            application/json:
	 *              schema:
	 *                type: object
	 *                properties:
	 *                  error:
	 *                    type: string
	 *                  details:
	 *                    type: string
	 */
	static async deleteUser(req: Request, res: Response): Promise<Response> {
		const { uuid } = req.params

		if (uuid == null || uuid == null)
			return res
				.status(400)
				.json({ error: 'Uuid is required to delete any user' })

		try {
			const response = await UserService.deleteUser(
				getTokenFromHeader(req),
				uuid,
			)
			return response == true
				? res
						.status(200)
						.json({ success: `User with uuid ${uuid} succesfully deleted` })
				: res.status(500).json({
						message: `Error: User with uuid ${uuid} cannot be deleted`,
				  })
		} catch (error) {
			if (error instanceof EndpointAccessError)
				return res
					.status(error.status)
					.json({ error: { message: error.message } })
			return res.status(500).json({
				error: `Unexpected error: User with uuid ${uuid} cannot be deleted`,
				details: error,
			})
		}
	}
}

export default UserController
