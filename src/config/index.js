const serverSettings = require('./app.config'),
    mongoSettings = require('./mongodb.config'),
    { registerDI } = require('./di.config');

let initDI = registerDI.bind(null, { serverSettings, mongoSettings });

module.exports = Object.assign({}, { initDI });
