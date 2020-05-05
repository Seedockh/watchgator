/** ****** MOCKING ****** **/
import sinon from 'sinon'
/** ****** INTERNALS ****** **/
import { DatabaseError } from '../../../src/core/CustomErrors'
import UserRepository from '../../../src/database/repositories/UserRepository'
import User from '../../../src/database/models/User'

class UserRepositoryMock {

    static createSuccess(successResponse: Omit<User, 'password'>) {
		return sinon
			.stub(UserRepository.instance, UserRepository.prototype.create.name)
			.returns(successResponse)
    }

	static createFailure() {
		return sinon
			.stub(UserRepository.instance, UserRepository.prototype.create.name)
			.throws(new DatabaseError('Mock', 400, undefined, []))
	}
}

export default UserRepositoryMock
