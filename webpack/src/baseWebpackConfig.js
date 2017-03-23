/* @flow */
const path = require('path')

module.exports = (
    PATHS: {
        app: string,
        base: string
    }
) => ({

    /**
     * Automatically try to load imports if the name has any of these
     * extensions In other words, do require("a") instead of
     * require("a.jsx")
     */
    resolve: {
        extensions: ['', '.js', '.jsx', '.json'],
        root: PATHS.app,

        /**
         * Whenever someone does import "react", resolve the one in
         * the node_modules at the top level, just in case a
         * dependency also has react in its node_modules, we don't
         * want to be running two versions of react!!!
         */
        alias: {
            react: path.join(PATHS.base, 'node_modules/react')
        }
    },
    module: {
        loaders: [
        ]
    },

    plugins: [

    ]
})
