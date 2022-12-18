// LOAD NODE MODULES
// ===========================================================================
import express, { Application } from 'express'
import requestIp from 'request-ip'

// LOAD OWN MODULES
// ===========================================================================
import configs from './configs'
import * as middleware from './middlewares'
import routesV1 from './routes/routesV1'
import validateEnv from './utils/validateEnv'

// SETUP LOGGER
// ===========================================================================
import logger from './utils/logger'

// CREATE & CONFIGURE EXPRESS SERVER
// ===========================================================================
const server: Application = express()

// BODY PARSING MIDDLEWARE
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

// ROUTES
routesV1(server)


// UTILS FUNCTIONS
validateEnv()

// DEBUG REQUEST
server.use(requestIp.mw())
server.use(middleware.debugRequest)

// ERROR HANDLERS 
// ===========================================================================
server.use(middleware.errorLoggerHandler)
server.use(middleware.missingJwtErrorHandler)
server.use(middleware.genericErrorHandler)
server.use(middleware.handleInvalidRequest)

// START SERVER
// ===========================================================================
try {
    server.listen(process.env.PORT || configs.port, (): void => {
        logger.info(`Connected successfully on port ${configs.port}`)
    })
} catch (error: any) {
    logger.error(`Error occured: ${error.message}`)
}