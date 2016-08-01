var _ = require('lodash');
var Operation = require('./operation');
var express = require('express');
var router = express.Router({mergeParams: true});

var Resource = function (name, model, options, api) {
    this.resourceName = name;
    this.model = model;
    this.options = options;
    this.api = api;
    this.operations = {};
};

var proto = Resource.prototype;

proto.operation = function (name, options) {
    var operation = new Operation(name, options, this);
    this.operations[name] = operation;

    return operation;
};

proto.router = function () {
    var name = this.resourceName;
    var baseRoute = this.options.baseRoute;
    var formatter = this.api.formatter;

    _.each(this.operations, function (operation) {
        router.use(baseRoute, operation.router(), formatter);
    });

    // Catch all handling
    router.use(baseRoute, function (req, res) {
        res.send('Unknown operation for resource: ' + name);
    });

    return router;
}

module.exports = Resource;