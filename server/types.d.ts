/********************************
 * Define Server Response types *
 ********************************/
interface BaseResponse {
	status: number
}

interface Token {
	token: string
}

interface IUser {
	uuid: string
	nickname: string
	email: string
	password: string
	avatar?: string | undefined
	movies: IUserMovies[]
}

interface IUserMovies {
	id: number
	user: string
	movie: string
}

interface AuthServiceResponse extends BaseResponse {
	data: {
		user: Omit<IUser, 'password'>
	}
	meta: Token
}

interface UserServiceResponse extends BaseResponse {
	data: {
		user?: Omit<IUser, 'password'>
	}
}

/********************
 * Define Log types *
 ********************/
type Ora = import('ora').Ora

/******************************
 * Define SearchPayload types *
 ******************************/
interface SearchPayload {
	names: SearchNamesPayload
	filters: SearchFiltersPayload
	page: number
	type: string
}

interface SearchNamesPayload {
	title: string
	actors: IMDBPerson[]
	directors: IMDBPerson[]
	genres: IMDBCategory[]
}

interface SearchFiltersPayload {
	year: IMDBFilter
	rating: IMDBFilter
	metaScore: IMDBFilter
	runtime: IMDBFilter
	nbRatings: IMDBFilter
	certificate: IMDBFilter
	gross: IMDBFilter
}

/************************
 * Define IMDB types *
 ************************/
interface MediaElement extends HTMLElement {
	innerText: string
	src: string
	href: string
}

interface Dataset {
	data: [IMDBMedia]
}

interface Dataset {
	data: [IMDBMedia]
}

interface IMDBMedia extends IMDBMediaBase {
	id: string | null
	title: string | null
	year: number | null
	rating: number | null
	nbRatings: number | null
	metaScore: number | null
	certificate: string | null
	runtime: number | null
	genres: (IMDBCategory | null)[]
	description: string | null
	picture: string | null
	directors: (IMDBPerson | null)[]
	actors: (IMDBPerson | null)[]
	gross: string | null
}

interface IMDBPeople {
	id: string | null
	firstname: string | null
	lastname: string | null
	picture: string | null
	role: string | null
}

interface IMDBPerson {
	id: string | null
	name: string | null
}

interface IMDBCategory {
	name: string | null
}

interface IMDBFilter {
	min: int | float
	max: int | float
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
