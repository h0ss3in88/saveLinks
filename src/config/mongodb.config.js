/* eslint-disable no-undef */
module.exports = {
    'host': process.env.MONGO_HOST || 'localhost',
    'port': process.env.MONGO_PORT || 27017,
    'db': process.env.MONGO_DB || 'linksDb'
};
