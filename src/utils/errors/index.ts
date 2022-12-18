const errors: any = {
    server_error: {
        code: 'error-server-internal',
        msg: 'Internal server error',
    },
    database_error: {
        code: 'error-database-internal',
        msg: 'Internal database error',
    },
    not_authorized: { code: 'error-not-authorized', msg: 'Not authorized' },
    method_not_allowed: {
        code: 'error-method-not-allowed',
        msg: 'Method not allowed',
    },
    invalid_data: { code: 'error-invalid-data', msg: 'Invalid data' },
    invalid_jwt: { code: 'error-invalid-jwt', msg: 'Authentication failed' },
    invalid_file: { code: 'error-invalid-file', msg: 'Invalid upload file' },
    invalid_request: { code: 'error-invalid-request', msg: 'Invalid request' },
    invalid_course_name: { code: 'error-invalid-course-name', msg: 'Invalid course name' },
    invalid_query: { code: 'error-invalid-query', msg: 'Invalid query' },
    network_error: {
        code: 'error-network-internal',
        msg: 'Internal network error',
    },
    not_found: { code: 'error-not-found', msg: 'Not found' },
    invalid_protocol: {
        code: 'error-invalid-protocol',
        msg: 'Invalid protocol',
    },
    unsupported_query: {
        code: 'error-unsupported-query',
        msg: 'Unsupported query',
    },
    max_limit_upload: {
        code: 'max-limit-upload',
        msg: 'File exceeds size limit'
    }
}

export const errorMsg = (error: string): string => {
    if (error in errors) {
        return errors[error].msg
    }
    return 'General error'
}

export const code = (error: string): string | undefined => {
    if (error in errors) {
        return errors[error].code
    }
}
