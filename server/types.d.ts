/********************************
 * Define Server Response types *
 ********************************/
interface BaseResponse {
	status: number
}

interface Token {
	token: string
}

interface AuthServiceResponse extends BaseResponse {
	data: {
		user: User
	}
	meta: Token
}

interface UserServiceResponse extends BaseResponse {
	data: {
		user: User
	}
}

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

interface Dataset {
	data: [IMDBMedia]
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
/********************
 * Extended Express types *
 ********************/
declare namespace Express {
	declare namespace Multer {
		export interface File {
			location: string
		}
	}
}
