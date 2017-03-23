/* eslint no-magic-numbers: off, max-lines: off */
module.exports = {
    env: {
        browser: true,
        es6: true,
        jest: true,
        node: true
    },
    globals: {
        'process.env': false,
        'NODE_ENV': false,
        '__DEV__': false,
        '__PROD__': false,
        '__TEST__': false,
        'HOST': false,
        'VERSION': false
    },
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
            experimentalObjectRestSpread: true
        }
    },
    plugins: [
        'react',
        'flowtype'
    ],
    extends: [
        'gw'
    ],
    rules: {
    }
}
