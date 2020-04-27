import supertest from 'supertest'
import request from 'superagent'

const basicSuite = (server: supertest.SuperTest<supertest.Test>) =>
	describe(':: Init tests', (): void => {
		it('ASSERTS that true = true, woaw', async () => {
			expect(true).toBe(true)
		}),
			it('simple get home', async done => {
				const res: request.Response = await server.get('/')
				expect(res.status).toBe(200)
				done()
			}),
			it('simple get home/api', async done => {
				const res: request.Response = await server.get('/api')
				expect(res.status).toBe(200)
				done()
			}),
			it('GRAPHQL_simple return hello', async done => {
				const res: request.Response = await server
					.post('/graphql')
					.set('Accept', 'application/json')
					.send({
						query: `
		  query {
			hello
		  }
		  `,
					})
				expect(res.status).toBe(200)
				done()
			})
	})
export default basicSuite
