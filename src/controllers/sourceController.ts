// LOAD NODE MODULES
// ===========================================================================
import { Request, Response, Router } from 'express'

// LOAD OWN MODULES
// ===========================================================================
// import logger from '../utils/logger'

// LOAD OWN MODULES
// ===========================================================================
import * as middleware from '../middlewares'

// LOAD DATABASE
// ===========================================================================
import db from '../models'

const sourceChannel: Router = Router()

sourceChannel.get(
    '/',
    middleware.asyncHandler(async (req: Request | any, res: Response) => {

        const newSource = await db.source.findMany()

        res.status(200).json(
            { status: 'success', message: null, data: newSource }
        )

    })
)

export default sourceChannel