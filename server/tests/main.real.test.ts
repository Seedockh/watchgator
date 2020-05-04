import runRealInCleanDb from './runRealInCleanDb'
import authRealTest from './routes/authRealTest'
import resolversRealTest from './controllers/graphQl/resolversRealTest'

describe('Tests to run sequentially in cleaned database', () => {
	runRealInCleanDb(authRealTest)
	// runRealInCleanDb(resolversRealTest)
})
