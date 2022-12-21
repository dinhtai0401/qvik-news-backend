import { z } from 'zod'

const sourceValidator = z.object({
    body: z.object(
        {
            sourceName: z.string().min(1).max(30),
        }
    ),
})

export default sourceValidator