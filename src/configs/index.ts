import development from './env/development'
import production from './env/production'

interface IConfig {
    env: string
    port: number
    defaultQuerySize: number
    // databaseURL: string
}

const defaults = {
    port: 1812,
    env: process.env.NODE_ENV || 'development',

    // DATABASE SETTINGS
    // databaseURL: process.env.DATABASE_URL!,
    defaultQuerySize: 100
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
