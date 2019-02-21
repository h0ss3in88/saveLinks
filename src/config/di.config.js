const { createContainer, asValue } = require('awilix'),
    debug = require('debug')('links'),
    { connectToDb } = require('../server/models'),
    registerDI = ({ serverSettings, mongoSettings }, mediator) => {
        mediator.on('init.di', () => {
            debug('DI initialization .... ');
            const container = createContainer({
                'injectionMode': 'PROXY'
            });

            container.register({
                'serverSettings': asValue(serverSettings),
                'mongoDb': asValue(mongoSettings)
            });
            connectToDb(container).then((result) => {
                const { db, objectId } = result;

                Object.keys(db.models).forEach((key) => {
                    container.register(key, asValue(db.model(key)));
                });
                container.register('ObjectId', asValue(objectId));
                mediator.emit('di.ready', container);
            }).catch((err) => {
                debug(`DB:error ${err}`);
                mediator.emit('db.error', err);
            });
        });
    };

module.exports = Object.assign({}, { registerDI });
