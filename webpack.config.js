'use strict';

const debug = true;
const path = require('path');
const externals = require('webpack-node-externals');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const server = {
    entry: './bin/www.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'puppet-webpack.bundle.js'
    },
    resolve: {
        extensions: ['*', '.js', '.json']
    },
    externals: [externals()],
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                uglifyOptions: {
                    warnings: false,
                    mangle: !debug,
                    keep_fnames: debug,
                    compress: {
                        unused: !debug
                    },
                },
            })
        ]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.json$/,
                loader: 'json'
            }
        ]
    },
    plugins: [

    ],
    mode: 'none',
    target: 'node'
};

module.exports = [server];
