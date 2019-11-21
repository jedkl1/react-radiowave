const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');

module.exports = merge(common, {

    module: {
        loaders: [
        {
            test: /\.jsx?$/,
            include: path.resolve(__dirname, 'src'),
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                cacheDirectory: true,
                presets: [require.resolve('babel-preset-react-app')],
            }
        },
        {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: [
                    {
                        loader: require.resolve('css-loader')
                    },
                    {
                        loader: require.resolve('postcss-loader'),
                        options: {
                            plugins: () => [
                                require('postcss-flexbugs-fixes'),
                                autoprefixer({
                                    browsers: [
                                        '>1%',
                                        'last 4 versions',
                                        'Firefox ESR',
                                        'not ie < 9',
                                    ],
                                    flexbox: 'no-2009',
                                }),
                            ],
                        },
                    },

                ] })
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            { test: /\.(png|jpeg|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
        ]
    },
  
    plugins: [
        new UglifyJSPlugin({
            parallel:  true,
            sourceMap: true
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new ExtractTextPlugin('static/css/[name].[hash].css')
    ]
});
