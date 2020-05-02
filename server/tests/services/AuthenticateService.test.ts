/** ****** TESTING ****** **/
import 'chai/register-should'
import 'chai/register-expect'
import Mock from '../mocks'
/** ****** INTERNALS ****** **/
import AuthenticateService from '../../src/services/AuthenticateService'
import { DatabaseError } from '../../src/core/CustomErrors'

describe('Register queries', (): void => {
	it('Successfull register', async () => {
		const mock = Mock.createUserSuccess()
		const { nickname, password, email } = Mock.successUser

		const actual = await AuthenticateService.register(nickname, password, email)
		expect(actual).to.deep.equal({
			status: 201,
			data: {
				user: Mock.successUser,
			},
			meta: Mock.successUserToken,
		})

		mock.restore()
	})

	it('Failed registration', async () => {
		const mock = Mock.createUserFailure()
		const { nickname, password, email } = Mock.failUser

		try {
			await AuthenticateService.register(nickname, password, email)
		} catch (e) {
			expect(e).to.be.an.instanceof(DatabaseError)
			expect(e.status).to.equal(400)
		}

		mock.restore()
	})
})
