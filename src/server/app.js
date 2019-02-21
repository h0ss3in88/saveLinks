/* eslint-disable no-undef */
const express = require('express'),
    logger = require('morgan'),
    compression = require('compression'),
    helmet = require('helmet'),
    bodyParser = require('body-parser'),
    responseTime = require('response-time'),
    errHandler = require('errorhandler'),
    path = require('path'),
    api = require('./api'),
    start = (container) => {
        return new Promise((resolve, reject) => {
            if (!container.resolve('serverSettings').port) {
                return reject(new Error('port number required'));
            }
            let port = container.resolve('serverSettings').port,
                app = express();

            app.use(logger('dev'));
            app.use('/public', express.static(path.resolve(__dirname, '../', 'client', 'dist')));
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({ 'extended': true }));
            app.use(helmet());
            app.use(compression());
            app.use(responseTime());
            app.set('port', port);
            app.set('x-powered-by', false);
            app.use((req, res, next) => {
                req.container = container.createScope();
                return next();
            });
            api(app);
            app.get('*', (req, res) => {
                return res.sendFile(path.resolve(__dirname, '../', 'client', 'dist', 'index.html'));
            });
            if (process.env.NODE_ENV === 'development') {
                app.use(errHandler());
            }
            return resolve(app);
        });
    };

module.exports = Object.assign({}, { start });
