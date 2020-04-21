import runInCleanDb from './utils/runInCleanDb'
import { basicSuite } from './suites'

describe('Tests to run sequentially in cleaned database', () => {
	runInCleanDb(basicSuite)
})
