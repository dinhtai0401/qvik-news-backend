import development from './env/development'
import production from './env/production'

interface IConfig {
    env: string
    port: number
}

const defaults = {
    port: 1812,
    env: process.env.NODE_ENV || 'development',

}

let config: IConfig

switch (defaults.env) {
    case 'development':
        config = Object.assign(defaults, development)
        break
    case 'production':
        config = Object.assign(defaults, production)
        break
    default:
        config = Object.assign(defaults, development)
        break
}

export default config
