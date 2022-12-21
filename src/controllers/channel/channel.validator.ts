import { z } from 'zod'

export const createNewChannelValidator = z.object({
    body: z.object(
        {
            channelName: z.string().min(1).max(30),
        }
    ),
})

export const getArticlesFromChannelValidator = z.object({
    params: z.object({
        channelName: z.string()
    })
})