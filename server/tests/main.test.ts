import runInCleanDb from './utils/runInCleanDb'
import { basicSuite, userAuthRestSuite, userAuthGraphSuite } from './suites'

describe('Tests to run sequentially in cleaned database', () => {
	runInCleanDb(basicSuite)
	runInCleanDb(userAuthRestSuite)
	runInCleanDb(userAuthGraphSuite)
})
