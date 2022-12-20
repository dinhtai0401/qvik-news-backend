import { cleanEnv, str, port } from 'envalid'

/**
 * Function to check & validate environment variables before running application
 */
const validateEnv = () => {
    cleanEnv(process.env, {
        // NODE_ENV: str({
        //     choices: ['development', 'staging','production'],
        // }),
        PORT: port({ default: 1812 }),
        DATABASE_URL: str()
    })
}

export default validateEnv
