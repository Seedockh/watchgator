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
	id: string | null,
	title: string | null,
	year: number | null,
	rating: number | null,
	nbRatings: number | null,
	metaScore: number | null,
	certificate: string | null,
	runtime: number | null,
	genres: (IMDBCategory | null)[],
	description: string | null,
	picture: string | null,
	directors: (IMDBPerson | null)[],
	actors: (IMDBPerson | null)[],
	gross: string | null,
}

interface IMDBPeople {
	id: string | null,
	firstname: string | null,
	lastname: string | null,
	picture: string | null,
	role: string | null
}

interface IMDBPerson {
	id: string | null,
	name: string | null
}

interface IMDBCategory {
	name: string | null
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
