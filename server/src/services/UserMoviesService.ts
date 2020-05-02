/** * ****** LODASH ****** **/
import _ from 'lodash'
/** ****** INTERNALS ****** **/
import UserRepository from '../database/repositories/UserRepository'
import UserMoviesRepository from '../database/repositories/UserMoviesRepository'
import IMDBDatasetService from './IMDBDatasetService'
import { DatabaseError } from '../core/CustomErrors'
import User from '../database/models/User'
import { throwIfManipulateSomeoneElse } from './utils'

class UserMoviesService {
	static env: string = process.env.NODE_ENV === 'production' ? 'live' : 'sample'

	static async getMovies(uuid: string): Promise<IMDBMedia[]> {
		if (typeof uuid === undefined) throw new Error('User uuid is not defined')

		const user = await UserRepository.instance.get({ uuid: uuid })
		if (user === undefined) throw new DatabaseError('User not found', 400)

		let movies: IMDBMedia[] = []
		user.movies.map((userMovie: IUserMovies) => {
			movies.push(_.find(
				// @ts-ignore: unreachable key
				IMDBDatasetService[`${this.env}Movies`].data,
				{ id: userMovie.movie }
			))
		})

		return movies
	}

	static async add(
		token: string | undefined,
		uuid: string,
		movieId: string,
	): Promise<void> {
		throwIfManipulateSomeoneElse(token, uuid)
		if (typeof uuid === undefined) throw new Error('User uuid is not defined')
		if (typeof movieId === undefined) throw new Error('Movie id is not defined')

		const user = await UserRepository.instance.get({ uuid: uuid })
		if (user === undefined) throw new DatabaseError('User not found', 400)
		else {
			user.movies.map((movie: IUserMovies) => {
				if (movie.movie === movieId) throw new DatabaseError('This movie is already saved for this User.', 400)
			})
		}

		const movie: IMDBMedia = _.filter(
			// @ts-ignore: unreachable key
			IMDBDatasetService[`${this.env}Movies`].data,
			{ id: movieId }
		)[0]
		if (movie === undefined) throw new DatabaseError('Movie not found', 400)

		await UserMoviesRepository.instance.add(user, movie)
	}

	static async deleteMovie(
		token: string | undefined,
		uuid: string,
		movieId: string,
	): Promise<boolean> {
		throwIfManipulateSomeoneElse(token, uuid)
		if (typeof uuid === undefined) throw new Error('User uuid is not defined')
		if (typeof movieId === undefined) throw new Error('Movie id is not defined')

		try {
			const movie = await UserMoviesRepository.instance.get({ movie: movieId })
			if (movie === undefined) throw new Error('Movie not found for this User')
			await UserMoviesRepository.instance.delete(`${movie.id}`)
			return true
		} catch (error) {
			throw error
		}
	}
}

export default UserMoviesService
