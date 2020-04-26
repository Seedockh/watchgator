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

/************************
 * Define Scraper types *
 ************************/
 interface MediaElement extends HTMLElement {
 	innerText: string,
	src: string,
	href: string
 }

interface IMDBMedia {
	title: string | null,
	year: string | null,
	rating: string | null,
	nbRatings: string | null,
	metaScore: string | null,
	certificate: string | null,
	runtime: string | null,
	genre: string | null,
	description: string | null,
	picture: string | null,
	director: string | null,
	casting: (string | null)[],
	gross: string | null,
}
