import { Application } from 'express'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import cacheControl from 'express-cache-controller'
import cors from 'cors'

// Passport import
import './passportMiddleware'
import { GraphQLLocalStrategy, buildContext } from 'graphql-passport'

// Swagger imports
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

// GraphQL imports
import { ApolloServer } from 'apollo-server-express'
import { typeDefs } from '../controllers/graphQl/typeDefs'
import { resolvers } from '../controllers/graphQl/resolvers'

export const Middlewares = (app: Application): void => {
	app.use(
		cors({
			origin: '*', // after change to url website
			credentials: true,
		}),
	)
	app.use(helmet())
	app.use(cacheControl({ noCache: true }))
	app.use(bodyParser.urlencoded({ extended: true }))

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
		},
		apis: ['../entities/User.ts', '../controllers/rest/AuthController.ts'],
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
	const server = new ApolloServer({
		typeDefs,
		resolvers,
	})
	server.applyMiddleware({ app })
}
