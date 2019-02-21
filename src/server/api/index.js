const ping = require('./lib/ping'),
    links = require('./lib/links'),
    tags = require('./lib/tags');

module.exports = (app) => {
    app.use('/api', ping());
    app.use('/api', links());
    app.use('/api', tags());
};
