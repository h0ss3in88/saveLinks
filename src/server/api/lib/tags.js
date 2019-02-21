const express = require('express'),
    { check, validationResult } = require('express-validator/check'),
    status = require('http-status'),
    { isMongoId, isEmpty } = require('validator'),
    _router = express.Router();

module.exports = () => {
    /** **************************
     /* return all of links
     /* GET /api/links
     **************************/
    _router.use((req, res, next) => {
        req.Links = req.container.resolve('Links');
        req.ObjectId = req.container.resolve('ObjectId');
        return next();
    });

    _router.get('/tags', (req, res, next) => {
        req.Links.distinct('tags').exec((err, result) => {
            if (err) {
                return next(err);
            } else if (result === null) {
                return res.status(status.NOT_FOUND).json([]);
            } else if (result === undefined) {
                return res.status(status.BAD_REQUEST);
            }
            return res.status(status.OK).json(result);
        });
    });

    _router.param('linkId', (req, res, next, value) => {
        if (isMongoId(value) && !isEmpty(value)) {
            req.id = value;
            return next();
        }
        return next(new Error('invalid links id'));
    });
    _router
        .route('/tags/:linkId')
        .get((req, res, next) => {
            req.Links.findOne({ '_id': req.id }).exec((err, result) => {
                if (err) {
                    return next(err);
                } else if (result === null) {
                    return res.status(status.NOT_FOUND).json([]);
                } else if (result === undefined ) {
                    return res.status(status.BAD_REQUEST);
                }
                return res.status(status.OK).json(result);
            });
        });
    return _router;
};
