/** ****** ENV ****** **/
require('dotenv').config()
/** ****** AUTH ****** **/
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { GraphQLLocalStrategy } from 'graphql-passport'
/** ****** ORM ****** **/
import { getRepository, Repository } from 'typeorm'
/** ****** INTERNALS ****** **/
import { User } from '../../database/models/User'

passport.use(
	new LocalStrategy(
		{
			usernameField: 'nickname',
			passwordField: 'password',
		},
		async (nickname, password, next) => {
			try {
				const userRepository: Repository<User> = getRepository(User)
				const user: User | undefined = await userRepository.findOne({
					nickname,
				})

				if (!user) return next('User does not exist')

				if (!user.checkIfUnencryptedPasswordIsValid(password))
					return next('Password does not match')

				return next(false, user)
			} catch (err) {
				return next(err.message)
			}
		},
	),
)

passport.use(
	new GraphQLLocalStrategy(
		async (
			username: any,
			password: any,
			next: (error: any, user?: any) => void,
		) => {
			try {
				const userRepository: Repository<User> = getRepository(User)

				const user: User | undefined = await userRepository.findOne({
					nickname: username,
				})

				if (!user) return next(null, false)
				if (!user.checkIfUnencryptedPasswordIsValid(password))
					return next(null, false)

				return next(false, user)
			} catch (err) {
				return next(err.message)
			}
		},
	),
)

passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // return 401 if format is not token
			secretOrKey: String(process.env.SECRET),
		},
		async (jwtPayload, next) => {
			console.log('JWT strategy')
			console.log('jwtPayload:')
			console.log(jwtPayload)
			try {
				const userRepository: Repository<User> = getRepository(User)
				const user: User | undefined = await userRepository.findOne({
					uuid: jwtPayload.id,
				})

				if (!user) throw new Error('user not found')

				return next(false, user)
			} catch (err) {
				return next(err.message) // status 500
			}
		},
	),
)
