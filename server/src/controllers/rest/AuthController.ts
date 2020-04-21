import { Request, Response } from 'express'
import {
	signupService,
	signinServiceRest,
} from '../../services/userAuthServices'

class AuthController {
	/**
	 * @swagger
	 * path:
	 *  /auth/signup:
	 *    post:
	 *      summary: Create a new user
	 *      tags: [Users]
	 *      requestBody:
	 *        required: true
	 *        content:
	 *          application/json:
	 *            schema:
	 *              $ref: '#/components/schemas/User'
	 *      responses:
	 *        "201":
	 *          description: New user created
	 *          content:
	 *            application/json:
	 *              schema:
	 *                $ref: '#/components/schemas/ResponseUserRegistered'
	 *        "400":
	 *          description: Incorrect input data - User not created
	 */

	static signup = async (req: Request, res: Response): Promise<Response> => {
		const { nickname, password, email } = req.body
		try {
			console.log('SIGN UP')
			console.log('BODY')
			console.log(req.body)
			console.log('nickname', nickname)
			console.log('password', password)
			console.log('email', email)

			const result = await signupService(nickname, password, email)
			return res.status(result.status).json(result)
		} catch (error) {
			return res.status(error.status).send(error.err)
		}
	}

	/**
	 * @swagger
	 * path:
	 *  /auth/signin:
	 *    post:
	 *      summary: Create a new user
	 *      tags: [Users]
	 *      requestBody:
	 *        required: true
	 *        content:
	 *          application/json:
	 *            schema:
	 *              $ref: '#/components/schemas/UserToSignIn'
	 *      responses:
	 *        "200":
	 *          description: User logged
	 *          content:
	 *            application/json:
	 *              schema:
	 *                type: array
	 *                $ref: '#/components/schemas/ResponseUserRegistered'
	 *        "400":
	 *          description: Incorrect input data - User not logged
	 */

	static signin = async (
		req: Request,
		res: Response,
	): Promise<Response | void> => {
		try {
			const result = await signinServiceRest(req, res)
			return res.status(result.status).json(result)
		} catch (error) {
			return res.status(error.status).send(error.err)
		}
	}
}
export default AuthController
