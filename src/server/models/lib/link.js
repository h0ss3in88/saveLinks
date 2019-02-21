const mongoose = require('mongoose'),
    schema = new mongoose.Schema({
        'link': { 'type': String, 'required': true },
        'category': { 'type': String, 'required': true },
        'description': { 'type': String, 'default': '' },
        'owner': { 'type': String, 'required': true },
        'tags': { 'type': [ String ], 'default': [] },
        'createdAt': { 'type': Date, 'default': Date.now() },
        'modifiedAt': { 'type': Date, 'default': Date.now() }
    });

let Links = mongoose.model('Links', schema);

module.exports = Object.assign({}, { schema, Links });
