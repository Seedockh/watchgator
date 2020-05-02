/** ****** TESTING ****** **/
import 'chai/register-should'
import 'chai/register-expect'
import Mock from '../../mocks'
/** ****** GRAPHQL ****** **/
import { AuthenticationError } from 'apollo-server-errors'
/** ****** INTERNALS ****** **/
import { resolvers } from '../../../src/controllers/graphQl/resolvers.ts'

describe('GraphQL Schema', (): void => {
	it('Check resolvers integrity', () => {
		resolvers.should.have.property('Query')
		resolvers.Query.should.have.property('hello')

		resolvers.should.have.property('Mutation')
		resolvers.Mutation.should.have.property('signUp')
		resolvers.Mutation.should.have.property('signIn')
	})
})

describe('GraphQL Queries', (): void => {
	it('Successful hello', () => {
		resolvers.Query.hello().should.equal('Hello world!')
	})
})

describe('GraphQL Muations', (): void => {
	it('Successful register', async () => {
		const mock = Mock.registerSuccess()
		const { nickname, email, password } = Mock.successUser

		const actual = await resolvers.Mutation.signUp(null, {
			nickname,
			email,
			password,
		})
		actual.should.equal(Mock.successUser)

		mock.restore()
	})

	it('Fails register validation', async () => {
		const mock = Mock.registerFailure()
		const { nickname, email, password } = Mock.failUser

		try {
			await resolvers.Mutation.signUp(null, { nickname, email, password })
		} catch (e) {
			expect(e).to.be.an('error')
		}

		mock.restore()
	})
})
