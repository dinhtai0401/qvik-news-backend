import { NextFunction, Request, Response } from 'express'
import logger from '../utils/logger'
import { errorMsg } from '../utils/errors'
import configs from '../configs'

export const asyncHandler =
    (fn: any) => (req: Request, res: Response, next: NextFunction) =>
        Promise.resolve(fn(req, res, next)).catch(next)

export const debugRequest = (
    req: Request | any,
    res: Response,
    next: NextFunction
) => {
    logger.debug(
        `IP: ${req.clientIp} - ${req.method} ${req.path} - ` +
        JSON.stringify({
            query: req.query,
            params: req.params,
            body: req.body,
        })
    )
    next()
}

export const errorLoggerHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (err.type === 'database_error' || err.type === 'server_error') {
        logger.error(errorMsg(err.type), err)
    }
    next(err)
}

export const missingJwtErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err.name === 'UnauthorizedError') {
        switch (err.code) {
            case 'credentials_required':
                logger.warn(
                    `No authorization token found..` + JSON.stringify(err)
                )
                return res.status(401).json({
                    status: false,
                    message: errorMsg('not_authorized'),
                })

            case 'invalid_token':
                logger.warn(
                    `Provided JWT is malformed or invalid.. ` +
                    JSON.stringify(err)
                )
                return res.status(401).json({
                    status: false,
                    message: errorMsg('not_authorized'),
                })

            default:
                logger.warn(`Authentication failed..` + JSON.stringify(err))
                return res.status(401).json({
                    status: false,
                    message: errorMsg('not_authorized'),
                })
        }
    }
    next(err)
}

export const genericErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    logger.error(err)
    err.statusCode = err.statusCode || 500
    err.type = err.type || 'server_error'
    res.status(err.statusCode).json({
        status: false,
        message: errorMsg(err.type),
    })
}

export const forceUpgradeHttps = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (configs.env !== 'development' && !req.secure) {
        return res.redirect("https://" + req.headers.host + req.url)
    }
    next()
}

export const handleInvalidRequest = (
    req: Request, 
    res: Response
) => {
    logger.warn(`Invalid request: ${req.method} ${req.path}`)
    return res.status(404).json({
        status: false,
        message: errorMsg('not_found'),
    })
}