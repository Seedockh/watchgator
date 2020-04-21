import { AuthenticationError } from 'apollo-server-errors'
import {
	signupService,
	SuccesResult,
	ErrorResult,
	signinServiceGql,
} from '../../services/userAuthServices'
import { User } from '../../entities/User'
import { Context } from 'graphql-passport/lib/buildContext'

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
				const result = await signupService(nickname, password, email)
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
				const result = await signinServiceGql(nickname, password, context)
				return (result as SuccesResult).data.user
			} catch (error) {
				throw new AuthenticationError((error as ErrorResult).err)
			}
		},
	},
}
