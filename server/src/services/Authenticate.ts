/** ****** SERVER ****** **/
import { Request, Response } from 'express'
/** ****** AUTH ****** **/
import * as jwt from 'jsonwebtoken'
import passport from 'passport'
import { validate, ValidationError } from 'class-validator'
import { Context } from 'graphql-passport/lib/buildContext'
/** ****** INTERNALS ****** **/
import { User } from '../database/models/User'
import UserRepository from '../database/repositories/UserRepository'
import { sLog } from '../core/Log'

class Authenticate {
	static token: string

	static setToken(user: User): string {
		const { uuid, nickname, email } = user
		return jwt.sign({ uuid, nickname, email }, String(process.env.SECRET))
	}

	static async register(
		nickname: string,
		password: string,
		email: string,
	): Promise<Result> {
		const user: User = new User()
		user.nickname = nickname
		user.password = password
		user.email = email

		return new Promise(
			async (
				resolve: (result: SuccesResult) => void,
				reject: (result: ErrorResult) => void,
			) => {
				// User data validation
				const errors: ValidationError[] = await validate(user)
				if (errors.length > 0) return reject({ status: 400, err: errors })

				try {
					user.hashPassword()
					// Add user to DB
					const createdUser = await UserRepository.create(user)

					this.token = this.setToken(createdUser)
					return resolve({
						status: 201,
						data: { user: createdUser },
						meta: { token: this.token },
					})
				} catch (error) {
					return reject({ status: 400, err: error.message })
				}
			},
		)
	}

	static async login(req: Request, res: Response): Promise<Result> {
		return new Promise(
			(
				resolve: (result: SuccesResult) => void,
				reject: (result: ErrorResult) => void,
			) => {
				passport.authenticate('local', { session: false }, (error, user) => {
					if (!error) {
						this.token = this.setToken(user)
						return resolve({
							status: 200,
							data: { user },
							meta: { token: this.token },
						})
					}

					return reject({ status: 400, err: error.message })
				})(req, res)
			},
		)
	}

	static async loginGraphQL(
		nickname: string,
		password: string,
		context: Context<User>,
	): Promise<Result | ErrorResult> {
		const { user } = await context.authenticate('graphql-local', {
			username: nickname,
			password,
		})

		if (user === undefined) {
			sLog('[GRAPHQL] Unable to login with those credentials.')
			return {
				status: 400,
				err: '[GRAPHQL] Unable to login with those credentials.',
			}
		}

		this.token = this.setToken(user)
		return { status: 200, data: { user }, meta: { token: this.token } }
	}
}

export default Authenticate
