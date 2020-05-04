/** ****** MOCKING ****** **/
import sinon from 'sinon'
/** ****** PASSPORT ****** **/
import passport from 'passport'
/** ****** INTERNALS ****** **/
import AuthenticateService from '../../src/services/AuthenticateService'
import { DatabaseError } from '../../src/core/CustomErrors'
import User from '../../src/database/models/User'
import UserRepositoryMock from '../database/repositories/UserRepository.mock'
import passportMock from '../routes/middlewares/passport.mock'

class AuthenticateServiceMock {
    /** * MOCKING SETTOKEN * **/

	static setToken(successToken: string) {
		return sinon
			.stub(AuthenticateService, AuthenticateService.setToken.name)
			.returns(successToken)
	}

    /** * MOCKING REGISTER * **/

	static registerSuccess(
		successUserResponse: Omit<User, 'password'>,
		sucessToken: string,
	) {
		return sinon
			.stub(AuthenticateService, AuthenticateService.register.name)
			.returns({
				status: 201,
				data: {
					user: successUserResponse,
				},
				meta: { token: sucessToken },
			})
	}

	static registerFailure() {
		return sinon
			.stub(AuthenticateService, AuthenticateService.register.name)
			.throws(new DatabaseError('Incorrect data', 400, undefined, []))
	}
    
    /** * MOCKING LOGIN * **/

	static loginSuccess(userEntry: User, tokenSuccess: string) {
		const { password, ...userWithoutPwd } = userEntry
		const userRepositoryStub = UserRepositoryMock.createSuccess(userWithoutPwd)
		const passportStub = passportMock.authenticateSuccess(userEntry)
        const setTokenStub = AuthenticateServiceMock.setToken(tokenSuccess)
	}

	static loginFailure() {
		const UserRepositoryStub = UserRepositoryMock.createFailure()
	}

}

export default AuthenticateServiceMock
