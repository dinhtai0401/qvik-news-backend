import { Application, Router } from 'express'

// CONTROLLERS
// ===========================================================================
import channelController from '../controllers/channel'
import sourceController from '../controllers/source'
import articleController from '../controllers/article'


const baseVer1 = '/api/v1'

const _routes: [string, Router][] = [
    [ baseVer1 + '/channels',   channelController ],
    [ baseVer1 + '/sources',    sourceController  ],
    [ baseVer1 + '/articles',   articleController  ],
]

const routesV1 = (app: Application) => {
    _routes.forEach((route) => {
        const [url, controller] = route
        app.use(url, controller)
    })
}

export default routesV1
