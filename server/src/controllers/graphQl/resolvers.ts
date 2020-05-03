/** ****** GRAPHQL ****** **/
import { AuthenticationError } from 'apollo-server-errors'
import { Context } from 'graphql-passport/lib/buildContext'
/** ****** INTERNALS ****** **/
import AuthenticateService from '../../services/AuthenticateService'
import User from '../../database/models/User'
import { DatabaseError } from '../../core/CustomErrors'

export const resolvers = {
	Query: {
		hello: (): string => 'Hello world!',
	},
	Mutation: {
		signUp: async (_: any, args: User): Promise<Omit<User, 'password'>> => {
			const { nickname, password, email } = args
			try {
				const result = await AuthenticateService.register(
					nickname,
					password,
					email,
				)
				return result.data.user
			} catch (error) {
				if (error instanceof DatabaseError)
					throw new AuthenticationError(error.details)
				throw new AuthenticationError(error)
			}
		},
		signIn: async (
			_: any,
			args: User,
			context: Context<User>,
		): Promise<Omit<User, 'password'>> => {
			const { nickname, password } = args
			try {
				const result = await AuthenticateService.loginGraphQL(
					nickname,
					password,
					context,
				)
				return result.data.user
			} catch (error) {
				if (error instanceof DatabaseError)
					throw new AuthenticationError(error.details)
				throw new AuthenticationError(error)
			}
		},
	},
}
