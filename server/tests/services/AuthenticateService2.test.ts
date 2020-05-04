/** ****** TESTING ****** **/
import 'chai/register-expect'
import Mock from '../mocks'
import sinon from 'sinon'
/** ****** SERVER TYPES ****** **/
import { Request, Response } from 'express'
/** ****** INTERNALS ****** **/
import AuthenticateService from '../../src/services/AuthenticateService'
import { DatabaseError } from '../../src/core/CustomErrors'
import AuthenticateServiceMock from './AuthenticateService.mock'

describe('Login queries', (): void => {
	it('Successfull login', async () => {
		const token = '1234'

		const userEntry = {
			uuid: '1',
			movies: [],
			nickname: 'john',
			email: 'johndoe@gmail.com',
			avatar: null,
			password: '1234',
		}

		const { ...expectedUserResponse } = userEntry
		delete expectedUserResponse.password

		const mock = AuthenticateServiceMock.loginSuccess(userEntry, token)
		const { nickname, password, email } = userEntry

		const req = Mock.loginRequest({
			nickname,
			password,
			email,
		})
		const actual = await AuthenticateService.login(
			req as Request,
			{} as Response,
		)
		expect(actual).to.deep.equal({
			status: 200,
			data: {
				user: expectedUserResponse,
			},
			meta: { token },
		})

		// mock.restore()
	})

	// it('Failed login', async() => {
	// 	const mock = Mock.passportAuthenticateFailure()
	// 	const { nickname, password, email } = Mock.successUserEntry

	// 	const req = Mock.loginRequest({
	// 		nickname,
	// 		password,
	// 		email,
	// 	})

	// 	try {
	// 		const actual = await AuthenticateService.login(
	// 			req as Request,
	// 			{} as Response,
	// 		)
	// 	} catch (e) {
	// 		expect(e.status).to.equal(400)
	// 		expect(e).to.be.instanceof(DatabaseError)
	// 	}

	// 	// mock.restore()
	// })
})
