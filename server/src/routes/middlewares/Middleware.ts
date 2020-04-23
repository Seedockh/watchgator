/** ****** SERVER ****** **/
import { Application } from 'express'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import cacheControl from 'express-cache-controller'
import cors from 'cors'
import { ApolloServer } from 'apollo-server-express'
/** ****** AUTH ****** **/
import passport from 'passport'
import { buildContext } from 'graphql-passport'
/** ****** DOCS ****** **/
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
/** ****** INTERNALS ****** **/
import './passportMiddleware'
import { User } from '../../database/models/User'
import { typeDefs } from '../../controllers/graphQl/typeDefs'
import { resolvers } from '../../controllers/graphQl/resolvers'

export const Middleware = (app: Application): void => {
	app.use(
		cors({
			origin: '*', // after change to url website
			credentials: true,
		}),
	)
	app.use(helmet())
	app.use(cacheControl({ noCache: true }))
	app.use(bodyParser.urlencoded({ extended: true }))
	app.use(bodyParser.json())

	// Swagger set up
	const options = {
		swaggerDefinition: {
			openapi: '3.0.0',
			info: {
				title: 'API WatchGator - Documentation',
				version: '1.0.0',
			},
			servers: [
				{
					url: `http://localhost:${process.env.PORT}/api/`,
				},
			],
			basePath: '/',
		},
		apis: [
			'./src/entities/User.ts',
			'./src/controllers/rest/AuthController.ts',
		],
	}
	const specs = swaggerJsdoc(options)
	app.use('/doc', swaggerUi.serve)
	app.get(
		'/doc',
		swaggerUi.setup(specs, {
			explorer: true,
		}),
	)

	// GraphQL startup
	app.use(passport.initialize())

	const server = new ApolloServer({
		typeDefs,
		resolvers,
		context: ({ req, res }) => buildContext({ req, res, User }),
	})
	server.applyMiddleware({ app })
}
