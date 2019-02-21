/* eslint-disable strict,one-var */
const mongoose = require('mongoose'),
    { schema } = require('./lib/link'),
    debug = require('debug')('links'),
    connectToDb = (container) => {
        return new Promise((resolve, reject) => {
            const mongo = container.resolve('mongoDb');
            // url pattern 'mongodb://username:password@host:port/database?options...'
            let mongoUrl = `mongodb://${mongo.host}:${mongo.port}/${mongo.db}`;

            try {
                mongoose.connect(mongoUrl, { 'useNewUrlParser': true });
                mongoose.connection.model('Links', schema);
                debug('mongoose models created and database object returned');
                mongoose.connection.on('open', () => {
                    debug('connection to mongodb is ready');
                });
                mongoose.connection.on('error', (err) => {
                    debug(`DB:error ${err}`);
                });
                return resolve({ 'db': mongoose.connection, 'objectId': mongoose.Types.ObjectId });
            } catch (error) {
                return reject(error);
            }
        });
    };

module.exports = Object.assign({}, { connectToDb });
