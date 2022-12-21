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
        size: z.coerce.number().positive().optional()
    })
})

export const searchArticlesValidator = z.object({
    query: z.object({
        f: z.coerce.number().nonnegative(),
        t: z.coerce.number().positive(),
    })
})