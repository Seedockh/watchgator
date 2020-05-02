/** ****** MOCKING ****** **/
import sinon from 'sinon'
/** ****** INTERNALS ****** **/
import AuthenticateService from '../src/services/AuthenticateService'
import { DatabaseError } from '../src/core/CustomErrors'
import UserRepository from '../src/database/repositories/UserRepository'

class Mock {
	private static successToken = '1234'
	static successUser = {
		uuid: '1',
		nickname: 'john',
		email: 'johndoe@gmail.com',
		password: 'johndoe',
		avatar: null,
	}
	static successUserToken = {
		token: Mock.successToken,
	}
	static failUser = {
		uuid: '1',
		nickname: 'j',
		email: 'johndoe',
		password: '',
		avatar: null,
	}

	/** * MOCKING AUTHSERVICE REGISTER SUCCESSFUL * **/
	static registerSuccess() {
		return sinon
			.stub(AuthenticateService, AuthenticateService.register.name)
			.returns({
				status: 201,
				data: {
					user: this.successUser,
				},
				meta: { token: '123' },
			})
	}

	/** * MOCKING AUTHSERVICE REGISTER FAILURE * **/
	static registerFailure() {
		return sinon
			.stub(AuthenticateService, AuthenticateService.register.name)
			.throws(new DatabaseError('Incorrect data', 400, undefined, []))
	}

	/** * MOCKING USEREPOSITORY CREATE SUCCESS * **/
	static createUserSuccess() {
		sinon
			.stub(UserRepository.instance, UserRepository.prototype.create.name)
			.returns(Mock.successUser)

		sinon
			.stub(AuthenticateService, AuthenticateService.setToken.name)
			.returns(Mock.successToken)

		return sinon
	}

	/** * MOCKING USEREPOSITORY CREATE FAILURE * **/
	static createUserFailure() {
		return sinon
			.stub(UserRepository.instance, UserRepository.prototype.create.name)
			.throws(new DatabaseError('Mock', 400, undefined, []))
	}
}

export default Mock
