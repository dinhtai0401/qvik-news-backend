// LOAD NODE MODULES
// ===========================================================================
import { Request, Response, Router } from 'express'

// LOAD OWN MODULES
// ===========================================================================
// import logger from '../utils/logger'

// LOAD OWN MODULES
// ===========================================================================
import * as middleware from '../../middlewares'
import { getArticlesValidator, addArticleValidator } from './article.validator'
import { fetchURLInfo } from '../../helpers'
import configs from '../../configs'

// LOAD DATABASE
// ===========================================================================
import db from '../../models'

const articleController: Router = Router()

articleController.get(
    '/',
    middleware.validate(getArticlesValidator),
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



// ACTIONS

// Add AN article
articleController.post(
    '/',
    middleware.validate(addArticleValidator),
    middleware.asyncHandler(async (req: Request, res: Response) => {

        const { articleURL, sourceId, channelId } = req.body

        const articleInfo = await fetchURLInfo(articleURL)

        const newArticle = await db.article.create({
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
            { status: 'success', message: 'add-channel-success', data: newArticle }
        )

    }),
    middleware.prismaErrorHandle
)

export default articleController