/* @flow */
import type {AppConfigType} from './config'
import WebpackDevServer from 'webpack-dev-server'
import type WebpackDevServerType from 'webpack-dev-server'
import express from 'express'
import webpack from 'webpack'

export type RoutingType = (
    app: WebpackDevServerType,
    express: typeof express
) => void

module.exports = function(
    appConfig: AppConfigType,
    webpackDevConfig: {
        output: {
            publicPath: string
        }
    },
    route: RoutingType,
    historyApiFallback: boolean = false
) {
    const {ENVIRONMENT} = appConfig

    const app = new WebpackDevServer(
        webpack(webpackDevConfig),
        {
            publicPath: webpackDevConfig.output.publicPath,
            hot: true,
            noInfo: false,
            stats: 'normal',
            historyApiFallback,
            staticOptions: {
                index: ['index.html']
            }
        }
    )

    route(app, express)

    app.use('/', express.static(appConfig.PATHS.app))
    app.use('/', express.static(appConfig.PATHS.distdll))

    app.listen(
        ENVIRONMENT.port,
        ENVIRONMENT.host,
        (err: Error | null) => {
            if (err) {

                /* eslint-disable no-console*/
                console.log(err)

                return
            }

            console.info(
                `
==> 🌎  Listening on port ${ENVIRONMENT.port}.

==>     Open up

          http://${ENVIRONMENT.host}:${ENVIRONMENT.port}/

        in your browser.`
            )
        }
    )
}
