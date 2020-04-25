/** ****** GRAPHQL ****** **/
import { AuthenticationError } from 'apollo-server-errors'
import { Context } from 'graphql-passport/lib/buildContext'
/** ****** INTERNALS ****** **/
import AuthenticateService from '../../services/AuthenticateService'
import { User } from '../../entities/User'


// TODO: voir pour utiliser type user du shared package à la place ?
interface UserToRegister {
	nickname: string
	password: string
	email: string
	birthDate: Date
}

// Provide resolver functions for your schema fields
export const resolvers = {
	Query: {
		hello: () => 'Hello world!',
	},
	Mutation: {
		signUp: async (_: any, args: UserToRegister): Promise<User | undefined> => {
			const { nickname, password, email } = args
			try {
				const result = await AuthenticateService.register(nickname, password, email)
				return (result as SuccesResult).data.user
			} catch (error) {
				throw new AuthenticationError((error as ErrorResult).err)
			}
		},
		signIn: async (
			_: any,
			args: UserToRegister,
			context: Context<User>,
		): Promise<User | undefined> => {
			const { nickname, password } = args
			try {
				const result = await AuthenticateService.loginGraphQL(nickname, password, context)
				return (result as SuccesResult).data.user
			} catch (error) {
				throw new AuthenticationError((error as ErrorResult).err)
			}
		},
	},
}
