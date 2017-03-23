/* eslint-disable flowtype/require-parameter-type */

const path = require('path')
const reactDocgen = require('react-docgen')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

/**
 * BundleAnalyzerOption
 *
 * const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
 */

const postcssCssnext = require('postcss-cssnext')
const postcssBrowserReporter = require('postcss-browser-reporter')
const postcssReporter = require('postcss-reporter')
const postcssStyleFmt = require('stylefmt')
const postcssStyleLint = require('stylelint')
const postcssDoiuse = require('doiuse')
const postcssUtilities = require('postcss-utilities')

module.exports = (dir, config, includes = []) => ({
    title: config.title,
    sections: config.sections,
    serverPort: 3340,
    template: path.join(__dirname, './template.html'),
    propsParser: (ignore, source) => reactDocgen.parse(
        source,
        reactDocgen.resolver.findAllComponentDefinitions
    ),

    updateWebpackConfig(webpackConfig) {

        /**
         * BundleAnalyzerOption
         *
         * webpackConfig.plugins.push(new BundleAnalyzerPlugin())
         */

        webpackConfig.entry.push(
            path.join(__dirname, './css/mod.css')
        )
        webpackConfig.entry.unshift('babel-polyfill')

        webpackConfig.plugins.push(
            new ExtractTextPlugin(
                'styleguide.css',
                {
                    ignoreOrder: true
                }
            ),

            new webpack.DefinePlugin({
                __DEV__: JSON.stringify(true)
            })
        )

        webpackConfig.module.loaders.push(
            {
                test: /\.js[x]?$/,
                include: [
                    dir,
                    __dirname
                ].concat(includes),
                loader: 'babel'
            },
            {
                test: /\.svg(\?.*)?$/,
                include: [
                    dir
                ].concat(includes),
                loader: 'url-loader?limit=20000'
            },
            {
                test: /\.(png|jpg)$/,
                include: [
                    dir
                ].concat(includes),
                loader: 'url-loader?name=[path][name].[ext]&limit=20000'
            },
            {
                test: /\.css$/,
                include: [
                    dir
                ].concat(includes),
                loader: ExtractTextPlugin.extract(
                    'style?sourceMap', [
                        'css?modules&importLoaders=2&localIdentName=[name]__[local]___[hash:base64:5]',
                        'postcss',
                        'less?compress=false'
                    ]
                )
            },
            {
                test: /\.css$/,
                include: [
                    path.join(__dirname, 'css')
                ],
                loaders: [
                    'style',
                    'css'
                ]
            }

        )

        webpackConfig.postcss = [
            postcssCssnext(),
            postcssUtilities(),
            postcssDoiuse(
                {
                    ignoreFiles: config.doiuseIgnoreFiles ?
                        config.doiuseIgnoreFiles
                        : [],
                    /* eslint-disable no-console */
                    onFeatureUsage: (usageInfo) =>
                        console.log(JSON.stringify(usageInfo))

                    /* eslint-enable no-console */
                }
            ),
            postcssStyleFmt(),
            postcssStyleLint(),
            postcssBrowserReporter(),
            postcssReporter()
        ]

        return webpackConfig
    }
})
