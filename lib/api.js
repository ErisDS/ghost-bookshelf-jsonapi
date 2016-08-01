var _ = require('lodash');
var Resource = require('./resource');
var express = require('express');
var router = express.Router();
var formatter = require('./middleware/formatter');

var api = exports = module.exports = {};

api.init = function () {
    this.resources = {};
    this.formatter = formatter(this.baseUrl);
};

api.url = function (url) {
    this.baseUrl = url;
};

/**
 * @param {BookshelfModel} model - Bookshelf model
 * @param {object} options - configuration for the resource
 * @returns {Resource}
 */
api.resource = function (model, options) {
    var name = _.result(model.prototype, 'tableName');
    var resource = new Resource(name, model, options, this);
    this.resources[name] = resource;

    return resource;
};

api.router = function () {
    _.each(this.resources, function (resource) {
        router.use(resource.router());
    });

    // Catch all handling
    router.use(function (req, res, next) {
        res.send('Unknown resource: ' + req.path);
    });

    return router;
};

