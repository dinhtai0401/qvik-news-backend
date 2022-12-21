// LOAD NODE MODULES
// ===========================================================================
import { Request, Response, Router } from 'express'

// LOAD OWN MODULES
// ===========================================================================
// import logger from '../utils/logger'

// LOAD OWN MODULES
// ===========================================================================
import * as middleware from '../../middlewares'
import { getAllArticlesValidator, addArticleValidator, getArticlesFromChannelValidator } from './article.validator'
import { fetchURLInfo } from '../../helpers'
import configs from '../../configs'

// LOAD DATABASE
// ===========================================================================
import db from '../../models'

const articleController: Router = Router()

// Get all articles from database
articleController.get(
    '/',
    middleware.validate(getAllArticlesValidator),
    middleware.asyncHandler(async (req: Request, res: Response) => {

        // Get size from the query parameters
        const size = Number(req.query.size) || configs.defaultQuerySize

        // Query the articles, applying pagination and ordering by the published field in descending order
        const articles = await db.article.findMany({
            // skip: offset,
            take: size,
            orderBy: { published: 'desc' },
        })

        res.status(200).json(
            { status: 'success', message: null, data: articles, totalResults: articles.length }
        )

    })
)

// Get articles from one channel
articleController.get(
    '/:channelName',
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

        if (!channelId) throw { code: 'error-invalid-request' }

        // Query the articles, applying pagination and ordering by the published field in descending order
        const articles = await db.article.findMany({
            // skip: offset,
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

// Add AN article
articleController.post(
    '/',
    middleware.validate(addArticleValidator),
    middleware.asyncHandler(async (req: Request, res: Response) => {

        const { articleURL, sourceId, channelId } = req.body

        const articleInfo = await fetchURLInfo(articleURL)

        // TODO: move this to models
        await db.article.create({
            data: {
                articleTitle: articleInfo.title,
                articleUrl: articleInfo.articleUrl,
                published: articleInfo.published,
                contentLength: articleInfo.contentLength,
                source: {
                    connect: {
                        id: sourceId
                    },
                },
                channel: {
                    connect: {
                        id: channelId
                    },
                },
            },
        })

        res.status(200).json(
            { status: 'success', message: 'add-channel-success', data: null }
        )

    }),
    middleware.prismaErrorHandle
)

export default articleController