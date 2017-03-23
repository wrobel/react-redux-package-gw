/* @flow */
const path = require('path')

const DEFAULT_PORT = 3000

export type AppConfigType = {
    env: string,
    PATHS: {
        base: string,
        app: string,
        locale: string,
        test: string,
        dist: string,
        distlocal: string,
        distdll: string,
        importdll: string
    },
    ENVIRONMENT: {
        host: string,
        port: number
    },
    globals: {
        'process.env': {
            NODE_ENV: string
        },
        'NODE_ENV': string,
        '__DEV__': string,
        '__PROD__': string,
        '__TEST__': string,
        'HOST': string,
        'VERSION': string
    }
}

module.exports = function(
    projectDirectory: string,
    PACKAGE: {
        version: string
    },
    defaultPort: number = DEFAULT_PORT,
    importdll: string = ''
): AppConfigType {

    /* eslint-disable no-process-env */

    const
        projectBasePath = path.resolve(projectDirectory),
        host = process.env.HOST || 'localhost',
        port = Number(process.env.PORT) || defaultPort,
        env = String(process.env.NODE_ENV)

    /* eslint-enable no-process-env */

    const isDev = env === 'development'
    const isProd = env === 'production'
    const isTest = env === 'test'

    return {

        /* eslint-disable no-process-env */
        env,

        /* eslint-enable no-process-env */
        PATHS: {
            base: projectBasePath,
            app: path.resolve(projectBasePath, 'app'),
            locale: path.resolve(projectBasePath, 'locale'),
            test: path.resolve(projectBasePath, 'test'),
            dist: path.resolve(projectBasePath, 'dist', 'deploy'),
            distlocal: path.resolve(projectBasePath, 'dist', 'local'),
            distdll: path.resolve(projectBasePath, 'dist', 'dll'),
            importdll
        },

        ENVIRONMENT: {
            host,
            port
        },

        globals: {
            'process.env': {
                NODE_ENV: JSON.stringify(
                    isDev ?
                        'development'
                        : 'production'
                )
            },
            'NODE_ENV': JSON.stringify(env),
            '__DEV__': JSON.stringify(isDev),
            '__PROD__': JSON.stringify(isProd),
            '__TEST__': JSON.stringify(isTest),
            'HOST': JSON.stringify(host),
            'VERSION': JSON.stringify(PACKAGE.version)
        }
    }
}
