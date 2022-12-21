import { z } from 'zod'

const channelValidator = z.object({
    body: z.object(
        {
            channelName: z.string().min(1).max(30),
        }
    ),
})

export default channelValidator