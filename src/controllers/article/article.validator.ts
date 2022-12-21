import { z } from 'zod'

export const addArticleValidator = z.object({
    body: z.object(
        {
            articleURL: z.string().url(),
            sourceId: z.number().min(1),
            channelId: z.number().min(1)
        }
    )
})

export const getAllArticlesValidator = z.object({
    query: z.object({
        size: z.preprocess(
            Number,
            z.number()
        ).optional()
    })
})

export const getArticlesFromChannelValidator = z.object({
    params: z.object({
        channelName: z.string()
    })
})
