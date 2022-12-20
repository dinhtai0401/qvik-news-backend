const production = {
    dbSSLConfig: true,
    sequelizeDialectOptions: { ssl: { required: true, rejectUnauthorized: false } },
}

export default production
