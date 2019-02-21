const path = require('path'),
    webpack = require('webpack');

module.exports = {
    'entry': path.resolve(__dirname, './src', 'client', 'src', 'index.js'),
    'output': {
        'filename': 'main.js',
        'path': path.resolve(__dirname, './src', 'client', 'dist')
    },
    'plugins': [
        new webpack.ProvidePlugin({
            '$': 'jquery',
            'jQuery': 'jquery',
            'window.jQuery': 'jquery',
            'tether': 'tether',
            'Tether': 'tether',
            'window.Tether': 'tether'
        })
    ],
    'watch': false,
    'module': {
        'rules': [
            {
                'test': /\.css$/,
                'use': [
                    'style-loader', 'css-loader'
                ]
            }, {
                'test': /\.(png|svg|jpg|gif)$/,
                'use': [
                    'file-loader'
                ]
            },
            {
                'test': /\.(woff|woff2|eot|ttf|otf)$/,
                'use': [
                    'file-loader'
                ]
            }, {
                'test': /\.js$/,
                'exclude': /(node_modules|bower_components)/,
                'use': {
                    'loader': 'babel-loader',
                    'options': {
                        'presets': [ 'env' ]
                    }
                }
            } ]
    }
};
