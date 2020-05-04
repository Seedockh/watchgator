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

describe('Register queries', (): void => {
	it('Successfull register', async () => {
		const mock = Mock.createUserSuccess()
		const { nickname, password, email } = Mock.successUserEntry

		const actual = await AuthenticateService.register(nickname, password, email)
		expect(actual).to.deep.equal({
			status: 201,
			data: {
				user: Mock.successUserResponse,
			},
			meta: Mock.successUserToken,
		})

		mock.restore()
	})

	it('Failed registration', async () => {
		const mock = Mock.createUserFailure()
		const { nickname, password, email } = Mock.failUserEntry

		try {
			await AuthenticateService.register(nickname, password, email)
		} catch (e) {
			expect(e).to.be.an.instanceof(DatabaseError)
			expect(e.status).to.equal(400)
		}

		mock.restore()
	})
})

describe('Login queries', (): void => {
	it('Successfull login', async () => {
		const mock = Mock.passportAuthenticateSuccess()
		const { nickname, password, email } = Mock.successUserEntry

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
				user: Mock.successUserResponse,
			},
			meta: Mock.successUserToken,
		})

		mock.restore()
	})

	it('Failed login', async () => {
		const mock = Mock.passportAuthenticateFailure()
		const { nickname, password, email } = Mock.successUserEntry

		const req = Mock.loginRequest({
			nickname,
			password,
			email,
		})

		try {
			const actual = await AuthenticateService.login(
				req as Request,
				{} as Response,
			)
		} catch (e) {
			expect(e.status).to.equal(400)
			expect(e).to.be.instanceof(DatabaseError)
		}

		mock.restore()
	})
})
