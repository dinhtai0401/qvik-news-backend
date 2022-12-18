import { Application, Router } from 'express'

import testController from '../controllers/testController'
const baseVer1 = '/api/v1'

const _routes: [string, Router][] = [
    [baseVer1 + '/', testController],
]

const routesV1 = (app: Application) => {
    _routes.forEach((route) => {
        const [url, controller] = route
        app.use(url, controller)
    })
}

export default routesV1
