import runInCleanDb from './utils/runInCleanDb'
import { basicSuite, userAuthRestSuite } from './suites'

describe('Tests to run sequentially in cleaned database', () => {
	runInCleanDb(basicSuite)
	runInCleanDb(userAuthRestSuite)
})
