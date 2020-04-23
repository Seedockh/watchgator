/********************************
 * Define Server Response types *
 ********************************/
interface BaseResult {
	status: number
}

interface Token {
	token: string
}

interface SuccesResult extends BaseResult {
	data: {
		user: User
	}
	meta: Token
}

interface ErrorResult extends BaseResult {
	err: any
}

type Result = SuccesResult | ErrorResult

/********************
 * Define Log types *
 ********************/
type Ora = import('ora').Ora
