/* eslint-disable no-undef */
const spdy = require('spdy'),
    cluster = require('cluster'),
    { start } = require('./src/server/app'),
    debug = require('debug')('links'),
    { cpus } = require('os'),
    { initDI } = require('./src/config'),
    { EventEmitter } = require('events');

let mediator = new EventEmitter();

process.on('uncaughtException', (error) => {
    debug(error);
});
process.on('unhandledRejection', (reason) => {
    debug(reason);
});

mediator.on('di.ready', (container) => {
    if (cluster.isMaster) {
        for (let i = 0; i < cpus().length; i++) {
            cluster.fork();
        }
        cluster.on('online', (worker) => {
            debug(`process forked on ${worker.process.pid} process id .`);
        });
        cluster.on('exit', (worker, code, signal) => {
            debug(`process with ${worker.process.pid} process id dead with ${code} code and ${signal}`);
        });
    } else if (cluster.isWorker) {
        start(container).then((app) => {
            let server = spdy.createServer(container.resolve('serverSettings').ssl, app);

            server.listen(app.get('port'), 'localhost', () => {
                debug(`links listening at : ${app.get('port')}`);
            });
        }).catch((err) => {
            debug(err);
        });
    }
});

initDI(mediator);
mediator.emit('init.di');
