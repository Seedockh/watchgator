/** ****** SERVER ****** **/
import { Request, Response } from 'express'
/** ****** INTERNALS ****** **/
import AuthenticateService from '../../services/AuthenticateService'
import { DatabaseError } from '../../core/CustomErrors'

class AuthController {
	static signup = async (req: Request, res: Response): Promise<Response> => {
		const { nickname, password, email } = req.body
		try {
			const result = await AuthenticateService.register(
				nickname,
				password,
				email,
			)
			return res.status(result.status).json(result)
		} catch (error) {
			if (error instanceof DatabaseError)
				return res
					.status(error.status)
					.send({ error: { message: error.message, details: error.details } })
			return res.status(400).send(error)
		}
	}

	static signin = async (
		req: Request,
		res: Response,
	): Promise<Response | void> => {
		try {
			const result = await AuthenticateService.login(req, res)
			return res.status(result.status).json(result)
		} catch (error) {
			if (error instanceof DatabaseError)
				return res.status(error.status).send(error.message)
			return res.status(500).send(error)
		}
	}
}
export default AuthController
