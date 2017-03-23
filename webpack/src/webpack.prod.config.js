/* @flow */
import type {AppConfigType} from './config'

const webpack = require('webpack')
const merge = require('webpack-merge')

const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const postcssCssnext = require('postcss-cssnext')
const postcssUtilities = require('postcss-utilities')

const path = require('path')
const fs = require('fs')

const baseWebpackConfig = require('./baseWebpackConfig')

/* eslint-disable max-statements */
module.exports = function(
    appConfig: AppConfigType,
    appName: string,
    title: string,
    options: {
        analyticsId: string,
        analyzeBundle: boolean,
        mouseflowTrackingId: string,
        useDll: boolean
    } = {
        analyticsId: '',
        analyzeBundle: false,
        mouseflowTrackingId: '',
        useDll: true
    }
) {
    const {
        PATHS
    } = appConfig

    const plugins = [
        // Force more consistent build hashes
        new webpack.optimize.OccurenceOrderPlugin(),

        new webpack.optimize.DedupePlugin(),

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

        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),

        new ExtractTextPlugin('[name]/style/[name]_[contenthash].css', {
            ignoreOrder: true
        }),

        new webpack.DefinePlugin(appConfig.globals)
    ]

    /* eslint-disable no-sync */
    if (options.useDll) {
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

        plugins.push(
            new webpack.DllReferencePlugin({
                context: '.',
                manifest: dllManifest
            })
        )

        plugins.push(
            new HtmlWebpackPlugin({
                filename: `${appName}/index.html`,
                template: './node_modules/react-redux-package-gw/webpack/html/base.template.html',
                title,
                dllAssets
            })
        )
    } else {
        plugins.push(
            new HtmlWebpackPlugin({
                filename: `${appName}/index.html`,
                template: './node_modules/react-redux-package-gw/webpack/html/base.template.html',
                title
            })
        )
    }

    /* eslint-enable no-sync */
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
             * Should be an empty object if it's generating a test build
             * Karma will handle setting it up for you when it's a test build
             */
            output: {

                // Write out files to our "dist/deploy" folder
                path: PATHS.dist,

                publicPath: '../',

                // Each entry point becomes a separate bundled file
                filename: '[name]/script/[name]_[hash].js'
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
                            'style?sourceMap', [
                                'css?modules&minimize&importLoaders=2',
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
                postcssUtilities()
            ],

            plugins,

            devtool: '#source-map'
        }
    )
}
