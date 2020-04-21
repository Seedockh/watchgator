import { AuthenticationError } from 'apollo-server-errors'
import {
	signupService,
	SuccesResult,
	ErrorResult,
	signinService,
} from '../../services/userAuthServices'
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
		// signin: async (_: any, args: User): Promise<User | undefined> => {
		// 	const { nickname, password, email } = args
		// 	try {
		// 		const result = await signinService()
		// 		return (result as SuccesResult).data.user
		// 	} catch (error) {
		// 		throw new AuthenticationError((error as ErrorResult).err)
		// 	}
		// },
	},
	Mutation: {
		signUp: async (
			parent: any,
			args: UserToRegister,
		): Promise<User | undefined> => {
			const { nickname, password, email } = args
			try {
				const result = await signupService(nickname, password, email)
				return (result as SuccesResult).data.user
			} catch (error) {
				throw new AuthenticationError((error as ErrorResult).err)
			}
		},
	},
}
