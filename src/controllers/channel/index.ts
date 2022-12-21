// LOAD NODE MODULES
// ===========================================================================
import { Request, Response, Router } from 'express'

// LOAD OWN MODULES
// ===========================================================================
// import logger from '../utils/logger'

// LOAD OWN MODULES
// ===========================================================================
import * as middleware from '../../middlewares'
import channelValidator from './channel.validator'

// LOAD DATABASE
// ===========================================================================
import db from '../../models'

const channelController: Router = Router()

channelController.get(
    '/',
    middleware.asyncHandler(async (req: Request, res: Response) => {

        const channels = await db.channel.findMany()

        res.status(200).json(
            { status: 'success', message: null, data: channels, totalResults: channels.length}
        )

    })
)

// ACTIONS

// Create a new channel
channelController.post(
    '/',
    middleware.validate(channelValidator),
    middleware.asyncHandler(async (req: Request, res: Response) => {

        const channelName = req.body.channelName

        await db.channel.create( { data: { channelName }} )

        res.status(200).json(
            { status: 'success', message: 'add-channel-success', data: null }
        )

    }),
    middleware.prismaErrorHandle,
)

export default channelController