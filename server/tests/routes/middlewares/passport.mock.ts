/** ****** MOCKING ****** **/
import sinon from 'sinon'
/** ****** PASSPORT ****** **/
import passport from 'passport'
/** ****** INTERNALS ****** **/
import User from '../../../src/database/models/User'

class PassportMock {

	static authenticateSuccess(successResponse: User) {
		return sinon
			.stub(passport, 'authenticate')
			.callsFake((strategy, options, callback) => {
				callback(null, successResponse, null)
				return (req, res, next) => {}
			})
	}

	static authenticateFailure() {
		return sinon
			.stub(passport, 'authenticate')
			.callsFake((strategy, options, callback) => {
				callback('User does not exist', null, null)
				return (req, res, next) => {}
			})
	}
}

export default PassportMock
