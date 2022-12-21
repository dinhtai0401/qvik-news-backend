// LOAD NODE MODULES
// ===========================================================================
import { Request, Response, Router } from 'express'

// LOAD OWN MODULES
// ===========================================================================
// import logger from '../utils/logger'

// LOAD OWN MODULES
// ===========================================================================
import * as middleware from '../../middlewares'
import sourceValidator from './source.validator'

// LOAD DATABASE
// ===========================================================================
import db from '../../models'

const sourceChannel: Router = Router()

// Get all sources from database
sourceChannel.get(
    '/',
    middleware.asyncHandler(async (req: Request, res: Response) => {

        const sources = await db.source.findMany()

        res.status(200).json(
            { status: 'success', message: null, data: sources, totalResults: sources.length }
        )

    })
)

// ACTIONS
sourceChannel.post(
    '/',
    middleware.validate(sourceValidator),
    middleware.asyncHandler(async (req: Request, res: Response) => {
        
        const sourceName = req.body.sourceName

        await db.source.create( { data: { sourceName } } )

        res.status(200).json(
            { status: 'success', message: 'add-source-success', data: null }
        )

    }),
    middleware.prismaErrorHandle,
)

export default sourceChannel