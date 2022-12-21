// LOAD NODE MODULES
// ===========================================================================
import { Request, Response, Router } from 'express'

// LOAD OWN MODULES
// ===========================================================================
import * as middleware from '../../middlewares'
import { getAllArticlesValidator, addArticleValidator, filterArticlesValidator } from './article.validator'
import { fetchURLInfo, sanitize } from '../../helpers'
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

        const articles = await db.article.findMany({
            take: size,
            orderBy: { published: 'desc' }
        })

        res.status(200).json(
            { status: 'success', message: null, data: articles, totalResults: articles.length }
        )

    })
)

// Filter articles from range
articleController.get(
    '/filter',
    middleware.validate(filterArticlesValidator),
    middleware.asyncHandler(async (req: Request, res: Response) => {

        const fromRange = Number(sanitize(req.query.f as string))
        const toRange = Number(sanitize(req.query.t as string))

        if (toRange <= fromRange) {
            throw { statusCode: 400, type: 'invalid_data' }
        }

        const articles = await db.article.findMany({
            orderBy: { published: 'desc' },
            where: {
                contentLength: {
                    gte: fromRange,
                    lte: toRange
                }
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
            { status: 'success', message: 'add-article-success', data: null }
        )

    }),
    middleware.prismaErrorHandle
)

export default articleController