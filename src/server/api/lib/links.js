/* eslint-disable new-cap */
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
    _router.get('/links', (req, res, next) => {
        req.Links.find({}, { 'category': 1, 'link': 1, 'description': 1, 'owner': 1, 'tags': 1, 'createdAt': 1, 'modifiedAt': 1 }).exec((err, links) => {
            if (err) {
                return next(err);
            } else if (links !== null || links !== undefined) {
                return res.status(status.OK).json(links);
            }
        });
    });
    /** **************************
     /* save new Link
     /* POST /api/links
     **************************/
    _router.post('/links', [
        check('link').not().isEmpty().isURL({ 'protocols': [ 'http', 'https' ] }).withMessage('link required'),
        check('category').trim().not().isEmpty().isAlpha().withMessage('category not specified'),
        check('description').isString().not().isEmpty().withMessage('description should be present'),
        check('owner').not().isEmpty().withMessage('owner should specify'),
        check('tags').isArray().not().isEmpty().withMessage('please tag this url')
    ], (req, res, next) => {
        if (!validationResult(req).isEmpty()) {
            let errors = validationResult(req).array();

            errors = errors.map((err) => {
                return { 'message': err.msg, 'loc': err.location, 'param': err.param };
            });
            return next(JSON.stringify(errors));
        }
        const { link, category, description, owner, tags } = req.body;

        req.Links.create({ link, category, description, owner, tags }, (err, newLink) => {
            if (err) {
                return next(err);
            }
            return res.status(status.CREATED).json(newLink);
        });
    });
    /** **************************
     /* Find new id and store it in req.id
     /* GET,POST,PUT,DELETE /api/links/:id
     **************************/
    _router.param('id', (req, res, next, value) => {
        if (isMongoId(value) && !isEmpty(value)) {
            req.id = value;
            return next();
        }
        return next(new Error('invalid links id'));
    });
    /** **************************
     /* GET /api/links/:id
     /* POST /api/links/:id
     /* DELETE /api/links/:id
     **************************/
    _router
        .route('/links/:id')
        .get((req, res, next) => {
            req.Links.findOne({ '_id': req.ObjectId(req.id) }).exec((err, result) => {
                if (err) {
                    return next(err);
                }
                if (result === null || result === undefined) {
                    return res.status(status.NOT_FOUND).send('NOT FOUND');
                }
                return res.status(status.OK).json(result);
            });
        })
        .put((req, res, next) => {
            let { link, description, owner, tags, modifiedAt } = req.body;

            modifiedAt = Date.now();
            req.Links.updateOne({ '_id': req.ObjectId(req.id) }, { link, description, owner, tags, modifiedAt }, (err, result) => {
                if (err) {
                    return next(err);
                } else if (result !== null && result !== undefined) {
                    if (result.ok === 1 && result.nModified === 1) {
                        return res.status(status.ACCEPTED).json(result.modifiedCount);
                    }
                    return res.status(status.BAD_REQUEST).json(result);
                }
            });
        })
        .delete((req, res, next) => {
            req.Links.deleteOne({ '_id': req.ObjectId(req.id) }, (err) => {
                if (err) {
                    return next(err);
                }
                return res.status(status.ACCEPTED).end();
            });
        });
    return _router;
};
