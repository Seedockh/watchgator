/** ****** MOCKING ****** **/
import sinon from 'sinon'
/** ****** INTERNALS ****** **/
import AuthenticateService from '../src/services/AuthenticateService'
import { DatabaseError } from '../src/core/CustomErrors'

class Mock {
    static successUser = {
      uuid: "1",
      nickname: "john",
      email: "johndoe@gmail.com",
      password: "johndoe",
      avatar: null
    }
    static failUser = {
      uuid: "1",
      nickname: "j",
      email: "johndoe",
      password: "",
      avatar: null
    }

    /** * MOCKING AUTHSERVICE REGISTER SUCCESSFUL * **/
    static registerSuccess() {
      return sinon.stub(AuthenticateService, 'register').returns({
          status: 201,
          data: {
            user: this.successUser
          },
          meta: { token: '123' },
      })
    }

    /** * MOCKING AUTHSERVICE REGISTER FAILURE * **/
    static registerFailure() {
      return sinon.stub(AuthenticateService, 'register').throws(
        new DatabaseError('Incorrect data', 400, undefined, [])
      )
    }
}

export default Mock
