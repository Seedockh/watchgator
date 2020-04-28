/** ****** NODE ****** **/
import fs from 'fs'
import fetch from 'node-fetch'
/** ****** LOG ****** **/
import { sLog, aLog } from '../core/Log'

class IMDBService {
  private sampleMovies
  private liveMovies

  static async init(): void {
    const spinner = aLog('Initializing Movies datas ...')
    this.sampleMovies = this.readSampleMovies()
    this.liveMovies = await this.readLiveMovies()
    spinner.succeed('Movies initialized')
  }

	static readSampleMovies(): Dataset {
     const moviesFile: Buffer = fs.readFileSync('src/database/imdb/imdb_movies_sample.json')
     // @ts-ignore: JSON.parse() unreachable Buffer param
     return JSON.parse(moviesFile)
   }

   static async readLiveMovies(): Promise<Dataset> {
     return await fetch(
       'https://mahara-bucket.s3.eu-west-3.amazonaws.com/watchgator/imdb_movies_live.json',
       { method: 'GET'}
     )
     .then(response => response.json())
     // @ts-ignore: JSON.parse() unreachable Buffer param
     .then(movies => JSON.parse(JSON.stringify(movies)))
   }
}

export default IMDBService
