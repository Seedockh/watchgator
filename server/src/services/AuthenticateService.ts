/** ****** SERVER ****** **/
import { Request, Response } from 'express'
/** ****** AUTH ****** **/
import * as jwt from 'jsonwebtoken'
import passport from 'passport'
import { validate, ValidationError } from 'class-validator'
import { Context } from 'graphql-passport/lib/buildContext'
/** ****** TYPEORM ****** **/
import { QueryFailedError } from 'typeorm'
/** ****** INTERNALS ****** **/
import User from '../database/models/User'
import UserRepository from '../database/repositories/UserRepository'
import { sLog } from '../core/Log'
import { DatabaseError } from '../core/CustomErrors'

class AuthenticateService {
	static token: string

	static setToken(user: User): string {
		const { uuid, nickname, email } = user
		return jwt.sign({ uuid, nickname, email }, String(process.env.SECRET))
	}

	static async register(
		nickname: string,
		password: string,
		email: string,
	): Promise<AuthServiceResponse> {
		const user: User = new User()
		user.nickname = nickname
		user.password = password
		user.email = email

		// User data validation
		const errors: ValidationError[] = await validate(user)
		if (errors.length > 0)
			throw new DatabaseError('Incorrect data', 400, undefined, errors)

		try {
			User.hashPassword(user)
			// Add user to DB
			const createdUser = await UserRepository.instance.create(user)
			const { ...userToReturn } = createdUser
			delete userToReturn.password

			this.token = this.setToken(createdUser)
			return {
				status: 201,
				data: { user: userToReturn },
				meta: { token: this.token },
			}
		} catch (error) {
			if (error instanceof QueryFailedError)
				throw new DatabaseError(error.message, 400, undefined, error)
			throw new DatabaseError('Unexpected error', 400)
		}
	}

	static async login(
		req: Request,
		res: Response,
	): Promise<AuthServiceResponse> {
		return new Promise(
			(resolve: (result: AuthServiceResponse) => void, reject: any) => {
				passport.authenticate('local', { session: false }, (error, user) => {
					if (!error && user) {
						this.token = this.setToken(user)

						const { ...userToReturn } = user
						delete userToReturn.password

						return resolve({
							status: 200,
							data: { user: userToReturn },
							meta: { token: this.token },
						})
					}
					return reject(new DatabaseError(error, 400))
				})(req, res)
			},
		)
	}

	static async loginGraphQL(
		nickname: string,
		pwd: string,
		context: Context<User>,
	): Promise<AuthServiceResponse> {
		try {
			const { user } = await context.authenticate('graphql-local', {
				username: nickname,
				password: pwd,
			})

			if (user === undefined) {
				sLog('[GRAPHQL] Unable to login with those credentials.')
				throw new DatabaseError(
					'[GRAPHQL] Unable to login with those credentials.',
					400,
				)
			}

			this.token = this.setToken(user)
			const { ...userToReturn } = user
			delete userToReturn.password

			return {
				status: 200,
				data: { user: userToReturn },
				meta: { token: this.token },
			}
		} catch (error) {
			if (error instanceof DatabaseError) throw error
			throw new DatabaseError('Unexpected error', 500, undefined, error)
		}
	}
}

export default AuthenticateService
