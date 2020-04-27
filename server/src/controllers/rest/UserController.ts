/** ****** SERVER ****** **/
import { Request, Response, RequestHandler } from 'express'
/** ****** INTERNALS ****** **/
import S3 from '../../services/s3Services'
import UserService from '../../services/UserService'
import { DatabaseError } from '../../core/CustomErrors'
import { User } from 'src/database/models/User'

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
	 *  /user/add-avatar/:
	 *    post:
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
	 *        "422":
	 *          description: Incorrect image data
	 *        "500":
	 *          description: Internal error
	 */

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

	/**
	 * @swagger
	 * path:
	 *  /user/remove-avatar/:fileKey:
	 *    delete:
	 *      summary: Delete avatar from AWS S3 by id
	 *      tags: [Users]
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
	 *              message:
	 *        "500":
	 *          description: Image cannot be deleted
	 *          content:
	 *            application/json:
	 *              message:
	 */
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
