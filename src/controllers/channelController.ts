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

const channelController: Router = Router()

channelController.get(
    '/',
    middleware.asyncHandler(async (req: Request | any, res: Response) => {

        const articlesFromSource = await db.channel.findMany()

        res.status(200).json(
            { status: 'success', message: null, data: articlesFromSource }
        )

    })
)

export default channelController