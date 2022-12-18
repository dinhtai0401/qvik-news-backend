import { Request, Response, Router } from 'express'
import logger from '../utils/logger'

import * as middleware from '../middlewares'

const testController: Router = Router()

testController.get(
    '/',
    middleware.asyncHandler(async (req: Request | any, res: Response) => {
        res.status(200).json({})
    })
)

export default testController