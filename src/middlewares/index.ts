// LOAD NODE MODULES
// ===========================================================================
import { NextFunction, Request, Response } from 'express'
import { AnyZodObject, ZodError } from 'zod'
import { Prisma } from '@prisma/client'

// LOAD OWN MODULES
// ===========================================================================
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

export const validate = (
    schema: AnyZodObject
) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        })
        return next()
    } catch (error: ZodError | any) {
        // return res.status(400).json(error)
        return res.status(400).json({
            status: false,
            message: error.issues,
        })
    }
}

export const prismaErrorHandle = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        logger.error(err)
        // The .code property can be accessed in a type-safe manner
        // Error ref: https://www.prisma.io/docs/reference/api-reference/error-reference
        switch (err.code) {
            case 'P2002':
                res.status(400).json({
                    status: false,
                    message: errorMsg('duplicate_data')
                })
                break
            case 'P2025':
                res.status(400).json({
                    status: false,
                    message: errorMsg('invalid_data')
                })
                break
            default:
                res.status(500).json({
                    status: false,
                    message: errorMsg('server_error')
                })
                break
        }
    }

    next()

}