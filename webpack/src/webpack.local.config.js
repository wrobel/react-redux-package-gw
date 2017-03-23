/* @flow */
import type {AppConfigType} from './config'

const webpack = require('webpack')
const merge = require('webpack-merge')

const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const postcssCssnext = require('postcss-cssnext')
const postcssBrowserReporter = require('postcss-browser-reporter')
const postcssReporter = require('postcss-reporter')
const postcssStyleFmt = require('stylefmt')
const postcssStyleLint = require('stylelint')
const postcssDoiuse = require('doiuse')
const postcssUtilities = require('postcss-utilities')

const path = require('path')
const fs = require('fs')

const baseWebpackConfig = require('./baseWebpackConfig')

module.exports = function(
    appConfig: AppConfigType,
    appName: string,
    title: string,
    options: {
        analyticsId: string,
        analyzeBundle: boolean,
        mouseflowTrackingId: string
    } = {
        analyticsId: '',
        analyzeBundle: false,
        mouseflowTrackingId: ''
    }
) {
    const {
        PATHS
    } = appConfig

    /* eslint-disable no-sync */
    const dllManifest = JSON.parse(
        fs.readFileSync(
            path.join(PATHS.importdll, 'vendor-manifest.json'),
            'utf8'
        )
    )

    const dllAssets = JSON.parse(
        fs.readFileSync(
            path.join(PATHS.importdll, 'dll-assets.json'),
            'utf8'
        )
    )

    /* eslint-enable no-sync */
    const plugins = [
        // Force more consistent build hashes
        new webpack.optimize.OccurenceOrderPlugin(),

        new webpack.DllReferencePlugin({
            context: '.',
            manifest: dllManifest
        }),

        /**
         * DefinePlugin allows us to define free variables, in any
         * webpack build, you can use it to create separate builds
         * with debug logging or adding global constants!  Here,
         * we use it to specify a development build.
         */
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            'GA_TRACKING_CODE': JSON.stringify(options.analyticsId),
            'MF_TRACKING_CODE': JSON.stringify(options.mouseflowTrackingId)
        }),

        new ExtractTextPlugin('[name]/style/[name].css', {
            ignoreOrder: true
        }),

        new webpack.DefinePlugin(appConfig.globals),

        new HtmlWebpackPlugin({
            filename: `${appName}/index.html`,
            template: './node_modules/react-redux-package-gw/webpack/html/base.template.html',
            title,
            dllAssets
        })
    ]

    if (options.analyzeBundle) {
        plugins.push(new BundleAnalyzerPlugin())
    }

    const entry = {}

    entry[appName] = PATHS.app

    return merge.smart(
        baseWebpackConfig(PATHS),
        {

            /**
             * Output
             * Reference: http://webpack.github.io/docs/configuration.html#output
             */
            output: {

                // Write out files to our "dist/local" folder
                path: PATHS.distlocal,

                publicPath: '../',

                // Each entry point becomes a separate bundled file
                filename: '[name]/script/[name].js'
            },

            /**
             * Entry
             * Reference: http://webpack.github.io/docs/configuration.html#entry
             */
            entry,

            module: {
                loaders: [
                    {
                        // Load all files with a .js or .jsx extension
                        test: /\.js[x]?$/,

                        // That reside within our 'src' folders
                        include: [PATHS.app, PATHS.test],

                        // And ignore anything that's a separate library
                        exclude: [/node_modules/],

                        // Run it through Babel, and cache results in the OS temp folder.
                        // Note that Babel itself is configured using a '.babelrc' file
                        loader: 'babel',
                        query: {
                            cacheDirectory: true
                        }
                    },
                    {
                        test: /\.json$/,
                        loader: 'json-loader'
                    },
                    {
                        test: /\.svg(\?.*)?$/,
                        loader: 'url-loader?name=assets/[hash].[ext]&limit=20000'
                    },
                    {
                        test: /\.(png|jpg)$/,
                        loader: 'url-loader?name=assets/[hash].[ext]&limit=20000'
                    },
                    {
                        test: /\.css$/,
                        loader: ExtractTextPlugin.extract(
                            'style?sourceMap',
                            [
                                'css?modules&importLoaders=2&localIdentName=[name]__[local]___[hash:base64:5]',
                                'postcss',
                                'less'
                            ],
                            {
                                publicPath: '../../'
                            }
                        )
                    }
                ]
            },

            postcss: [
                postcssCssnext(),
                postcssUtilities(),
                postcssDoiuse(),
                postcssStyleFmt(),
                postcssStyleLint({
                    config: {
                        extends: 'stylint-config-gw'
                    }
                }),
                postcssBrowserReporter(),
                postcssReporter()
            ],

            plugins,

            devtool: '#source-map'
        }
    )
}
