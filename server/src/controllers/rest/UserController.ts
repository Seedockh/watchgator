/** ****** SERVER ****** **/
import { Request, Response } from 'express'
/** ****** INTERNALS ****** **/
import UserService from '../../services/UserService'
import { DatabaseError, EndpointAccessError } from '../../core/CustomErrors'
import { User } from '../../database/models/User'
import { getTokenFromHeader } from './utils'

class UserController {
	/**
	 * @swagger
	 *  components:
	 *    schemas:
	 *      AvatarToAdd:
	 *        type: object
	 *        required:
	 *          - uuid
	 *          - file
	 *        properties:
	 *          uuid:
	 *            type: integer
	 *            description: uuid of user we want to add avatar
	 *          file:
	 *            type: image
	 *            format: jpeg-jpd-png
	 *        example:
	 *           uuid: 1234
	 *           file: image.png
	 *      ResponseUnauthorized:
	 *         type: object
	 *         properties:
	 *           error:
	 *             type: object
	 *             properties:
	 *               message:
	 *                 type: string
	 *      ResponseUserWithAvatar:
	 *        example:
	 *          user:
	 *            uuid: 4c2d544a-803f-4668-b4ed-410a1f
	 *            nickname: Bob1
	 *            email: bob1@gmail.com
	 *            password: bob1
	 *            birthDate: 01/01/2000
	 *            avatar:
	 * path:
	 *  /user/update-avatar/:
	 *    put:
	 *      summary: Update avatar of user specified by uuid in body
	 *      tags: [Users]
	 *      requestBody:
	 *        required: true
	 *        content:
	 *          application/json:
	 *            schema:
	 *              $ref: '#/components/schemas/AvatarToAdd'
	 *      parameters:
	 *        - in: header
	 *          name: Authorization
	 *          description: Bearer + TOKEN
	 *          schema:
	 *            type: string
	 *            format: token
	 *          required: true
	 *        - in: formData
	 *          name: file
	 *          type: file
	 *          description: file to upload
	 *          required: true
	 *      responses:
	 *        "200":
	 *          description: User id updated
	 *          content:
	 *            application/json:
	 *              schema:
	 *                $ref: '#/components/schemas/ResponseUserWithAvatar'
	 *        "403":
	 *          description: Only operations on its own user are allowed
	 *          content:
	 *            application/json:
	 *              schema:
	 *                $ref: '#/components/schemas/ResponseUnauthorized'
	 *        "422":
	 *          description: Incorrect image data
	 *        "500":
	 *          description: Internal error
	 */

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

	/**
	 * @swagger
	 *  components:
	 *    schemas:
	 *      BodyAvatarToDelete:
	 *        type: object
	 *        required:
	 *          - uuid
	 *        properties:
	 *          uuid:
	 *            type: integer
	 *            description: uuid of user we want to remove avatar
	 *        example:
	 *           uuid: 1234
	 * path:
	 *  /user/delete-avatar/:fileKey:
	 *    delete:
	 *      summary: Delete avatar from AWS S3 by id
	 *      tags: [Users]
	 *      requestBody:
	 *        required: true
	 *        content:
	 *          application/json:
	 *            schema:
	 *              $ref: '#/components/schemas/BodyAvatarToDelete'
	 *      parameters:
	 *        - in: path
	 *          name: fileKey
	 *          description: id of AWS file
	 *          schema:
	 *            type: integer
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
	 *          description: Image correctly deleted
	 *          content:
	 *            application/json:
	 *              schema:
	 *                type: object
	 *                properties:
	 *                  message:
	 *                    type: string
	 *        "403":
	 *          description: Only operations on its own user are allowed
	 *          content:
	 *            application/json:
	 *              schema:
	 *                $ref: '#/components/schemas/ResponseUnauthorized'
	 *        "500":
	 *          description: Image cannot be deleted
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
	static async deleteAvatar(req: Request, res: Response): Promise<Response> {
		try {
			const result = await UserService.deleteAvatar(
				getTokenFromHeader(req),
				req.body.uuid,
				req.params.fileKey,
			)
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

		if (typeof uuid == 'undefined')
			return res
				.status(400)
				.json({ error: 'Uuid is required to delete any user' })

		try {
			const response = await UserService.deleteUser(
				getTokenFromHeader(req),
				uuid,
			)
			return response
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

	static async updateUser(req: Request, res: Response): Promise<Response> {
		const { uuid } = req.body
		if (typeof uuid == 'undefined')
			return res
				.status(400)
				.json({ error: 'Uuid is required to edit any user' })

		try {
			const response = await UserService.updateUser(getTokenFromHeader(req), {
				...req.body,
			})

			if (response)
				return res
					.status(200)
					.json({ success: `User with uuid ${uuid} succesfully updated` })
			throw new Error('Incorrect keys in body')
		} catch (error) {
			if (error instanceof EndpointAccessError)
				return res
					.status(error.status)
					.json({ error: { message: error.message } })
			return res.status(500).json({
				error: `Unexpected error: User with uuid ${uuid} cannot be deleted`,
				details: error.message || error,
			})
		}
	}
}

export default UserController
