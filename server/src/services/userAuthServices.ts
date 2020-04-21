import { Request, Response } from 'express'

// Passport imports
import * as jwt from 'jsonwebtoken'
import passport from 'passport'

// DB imports
import { validate, ValidationError } from 'class-validator'
import { User } from '../entities/User'
import { addUserRepository } from '../repositories/userRepository'
import { Context } from 'graphql-passport/lib/buildContext'

interface BaseResult {
	status: number
}

export interface SuccesResult extends BaseResult {
	data: {
		user: User
	}
	meta: {
		token: string
	}
}

export interface ErrorResult extends BaseResult {
	err: any
}

type Result = SuccesResult | ErrorResult

export const setToken = (user: User): string => {
	const { uuid, nickname, email } = user
	const payload = { uuid, nickname, email }
	return jwt.sign(payload, String(process.env.SECRET))
}

export const signupService = async (
	nickname: string,
	password: string,
	email: string,
): Promise<Result> => {
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
			console.log('VALIDATION')
			const errors: ValidationError[] = await validate(user)
			if (errors.length > 0) {
				console.log('UNVALID')
				console.log(errors)
				reject({
					status: 400,
					err: errors,
				})
			}
			// Add user to DB
			else {
				user.hashPassword()

				try {
					const insertedUser = await addUserRepository(user)

					const token = setToken(insertedUser)

					resolve({
						status: 201,
						data: { user: insertedUser },
						meta: { token },
					})
				} catch (error) {
					console.log('ERROR')
					console.log(error)
					reject({
						status: 400,
						err: error.message,
					})
				}
			}
		},
	)
}

export const signinServiceGql = async (
	nickname: string,
	password: string,
	context: Context<User>,
): Promise<Result | undefined> => {
	const { user } = await context.authenticate('graphql-local', {
		username: nickname,
		password,
	})

	if (user == undefined) {
		console.log('ERROR')
		return
	}
	const token = setToken(user)
	return { status: 201, data: { user }, meta: { token } }
}

export const signinServiceRest = async (
	req: Request,
	res: Response,
): Promise<Result> => {
	return new Promise(
		(
			resolve: (result: SuccesResult) => void,
			reject: (result: ErrorResult) => void,
		) => {
			passport.authenticate(
				'local',
				{ session: false },
				async (error, user) => {
					if (!error) {
						const token: string = setToken(user)
						resolve({
							status: 201,
							data: { user },
							meta: { token },
						})
					} else {
						reject({
							status: 400,
							err: error.message,
						})
					}
				},
			)(req, res)
		},
	)
}
