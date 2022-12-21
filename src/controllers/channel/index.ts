// LOAD NODE MODULES
// ===========================================================================
import { Request, Response, Router } from 'express'

// LOAD OWN MODULES
// ===========================================================================
import * as middleware from '../../middlewares'
import { getArticlesFromChannelValidator, createNewChannelValidator } from './channel.validator'
import configs from '../../configs'

// LOAD DATABASE
// ===========================================================================
import db from '../../models'

const channelController: Router = Router()

// Get all channels from database
channelController.get(
    '/',
    middleware.asyncHandler(async (req: Request, res: Response) => {

        const channels = await db.channel.findMany()

        res.status(200).json(
            { status: 'success', message: null, data: channels, totalResults: channels.length}
        )

    })
)

// Get articles from one channel
channelController.get(
    '/:channelName/articles',
    middleware.validate(getArticlesFromChannelValidator),
    middleware.asyncHandler(async (req: Request, res: Response) => {

        const channelName = req.params.channelName
        // Get size from the query parameters
        const size = Number(req.query.size) || configs.defaultQuerySize

        // Get Channel ID
        const channelId = await db.channel.findFirst({
            where: {
                channelName
            }
        })
        if (!channelId) throw { type: 'invalid_request' }

        const articles = await db.article.findMany({
            take: size,
            orderBy: { published: 'desc' },
            where: {
                channelId: channelId.id
            }
        })

        res.status(200).json(
            { status: 'success', message: null, data: articles, totalResults: articles.length }
        )

    }),
    middleware.prismaErrorHandle
)

// ACTIONS

// Create a new channel
channelController.post(
    '/',
    middleware.validate(createNewChannelValidator),
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