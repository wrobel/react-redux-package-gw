/* @flow */
import type {AppConfigType} from './config'

const AssetsPlugin = require('assets-webpack-plugin')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')

const path = require('path')
const webpack = require('webpack')

module.exports = function(
    appConfig: AppConfigType,
    dependencies: string[],
    options: {
        analyzeBundle: boolean
    } = {
        analyzeBundle: false
    }
) {
    const {PATHS} = appConfig

    const plugins = [
        new webpack.DllPlugin({
            path: path.join(PATHS.distdll, '[name]-manifest.json'),
            name: '[name]_[hash]'
        }),

        /**
         * DefinePlugin allows us to define free variables, in any
         * webpack build, you can use it to create separate builds
         * with debug logging or adding global constants!  Here,
         * we use it to specify a development build.
         */
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),

        new AssetsPlugin({
            path: PATHS.distdll,
            filename: 'dll-assets.json',
            fullPath: false,
            prettyPrint: true
        }),

        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]

    if (options.analyzeBundle) {
        plugins.push(new BundleAnalyzerPlugin())
    }

    return {
        entry: {
            vendor: dependencies
        },
        devtool: 'source-map',
        output: {
            path: PATHS.distdll,
            filename: '[name]_[hash].dll.js',
            library: '[name]_[hash]'
        },
        plugins
    }
}
