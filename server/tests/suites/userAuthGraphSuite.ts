import supertest from 'supertest'
import request from 'superagent'
import { User } from '../../src/database/models/User'

const graphQlAuthRoutesSuite = (server: supertest.SuperTest<supertest.Test>) =>
	describe('GraphQL - Auth routes', () => {
		const userWithCorrectData: User = new User()
		userWithCorrectData.nickname = 'Bob'
		userWithCorrectData.password = 'bob1'
		userWithCorrectData.email = 'bob@gmail.com'

		describe('GraphQL - Sign Up routes', () => {
			it('Sign Up with correct data should return 200 and body should contains a User', async done => {
				const query = `mutation {
        signUp(nickname: "bobi22", email: "bob@gmail.com", password: "boob1")
        {uuid, nickname, email, password}
      }`
				const res: request.Response = await server
					.post('/graphql')
					.set('Accept', 'application/json')
					.send({ query })
				expect(res.status).toBe(200)
				expect(res.body.data).toBeDefined()
				expect(res.body.errors).toBeUndefined()
				done()
			})
			it('Sign Up with an already used nickname should return 200 AND body should contains errors', async done => {
				const query = `mutation {
        signUp(nickname: "bobi22", email: "bob@gmail.com", password: "boob1")
        {uuid, nickname, email, password}
      }`
				const res: request.Response = await server
					.post('/graphql')
					.set('Accept', 'application/json')
					.send({ query })
				expect(res.status).toBe(200)
				expect(res.body.data).toBeDefined()
				expect(res.body.errors).toBeDefined()
				expect(res.body.errors[0].extensions.code).toBe('UNAUTHENTICATED')
				done()
			})
		})
		describe('GraphQL - Sign In routes', () => {
			it('Sign In with correct data should return an error', async done => {
				const query = `mutation {
                    signIn(nickname: "bobi22", email: "bob@gmail.com", password: "boob1")
                    {uuid, nickname, email, password}
      }`
				const res: request.Response = await server
					.post('/graphql')
					.set('Accept', 'application/json')
					.send({ query })
				expect(res.status).toBe(200)
				expect(res.body.data).toBeDefined()
				expect(res.body.errors).toBeUndefined()
				done()
			})
			it('Sign In with inexistant user', async done => {
				const query = `mutation {
        signIn(nickname: "inexistantNickName", email: "bob@gmail.com", password: "boob1")
        {uuid, nickname, email, password}
      }`
				const res: request.Response = await server
					.post('/graphql')
					.set('Accept', 'application/json')
					.send({ query })
				expect(res.status).toBe(200)
				expect(res.body.data).toBeNull()
				expect(res.body.errors).toBeDefined()
				expect(res.body.errors[0].extensions.code).toBe('INTERNAL_SERVER_ERROR')
				done()
			})
		})
	})

export default graphQlAuthRoutesSuite
