/* @flow */
import type {AppConfigType} from './config'

const webpack = require('webpack')
const merge = require('webpack-merge')

const postcssCssnext = require('postcss-cssnext')
const postcssBrowserReporter = require('postcss-browser-reporter')
const postcssReporter = require('postcss-reporter')
const postcssStyleFmt = require('stylefmt')
const postcssStyleLint = require('stylelint')
const postcssDoiuse = require('doiuse')
const postcssUtilities = require('postcss-utilities')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')

const baseWebpackConfig = require('./baseWebpackConfig')

/**
 * Optional Bundle Analyzer Plugin
 *
 * const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
 */

module.exports = function(
    appConfig: AppConfigType,
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
        PATHS,
        ENVIRONMENT
    } = appConfig

    const boilerplate = [
        'react-hot-loader/patch',
        `webpack-dev-server/client?http://${ENVIRONMENT.host}:${ENVIRONMENT.port}`,
        'webpack/hot/only-dev-server'
    ]

    const plugins = [
        // Force more consistent build hashes
        new webpack.optimize.OccurenceOrderPlugin(),

        /**
         * This is where the magic happens! You need this to
         * enable Hot Module Replacement!
         */
        new webpack.HotModuleReplacementPlugin(),

        /**
         * NoErrorsPlugin prevents your webpack CLI from exiting
         * with an error code if there are errors during compiling
         * - essentially, assets that include errors will not be
         * emitted. If you want your webpack to 'fail', you need
         * to check out the bail option.
         */
        new webpack.NoErrorsPlugin(),

        /**
         * DefinePlugin allows us to define free variables, in any
         * webpack build, you can use it to create separate builds
         * with debug logging or adding global constants!  Here,
         * we use it to specify a development build.
         */
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
            'GA_TRACKING_CODE': JSON.stringify(options.analyticsId),
            'MF_TRACKING_CODE': JSON.stringify(options.mouseflowTrackingId)
        }),

        new webpack.DefinePlugin(appConfig.globals),

        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './node_modules/react-redux-package-gw/webpack/html/base.template.html',
            title
        })
    ]

    if (options.analyzeBundle) {
        plugins.push(new BundleAnalyzerPlugin())
    }

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

                // Write out files to our "dist" folder
                path: PATHS.dist,

                publicPath: '/',

                // Each entry point becomes a separate bundled file
                filename: '[name]/script/[name]_[hash].js'
            },

            /**
             * Entry
             * Reference: http://webpack.github.io/docs/configuration.html#entry
             */
            entry: {
                app: boilerplate.concat(
                    PATHS.app
                )
            },

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
                            babelrc: false,
                            cacheDirectory: true,
                            presets: [
                                'es2015',
                                'stage-2',
                                'react'
                            ],
                            plugins: [
                                'transform-flow-strip-types',
                                'transform-react-jsx-self',
                                'react-hot-loader/babel'
                            ]
                        }
                    },
                    {
                        test: /\.json$/,
                        loader: 'json-loader'
                    },
                    {
                        test: /\.svg(\?.*)?$/,
                        loader: 'url-loader?limit=20000'
                    },
                    {
                        test: /\.(png|jpg)$/,
                        loader: 'url-loader?name=[path][name].[ext]&limit=20000'
                    },
                    {
                        test: /\.css$/,
                        loaders: [
                            'style?sourceMap',
                            'css?modules&importLoaders=2&localIdentName=[name]__[local]___[hash:base64:5]',
                            'postcss',
                            'less'
                        ]
                    }
                ]
            },

            resolve: {
                alias: {
                }
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

            // Generate sourcemaps using a faster method
            devtool: '#cheap-module-inline-source-map'

        }
    )
}
