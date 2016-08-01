var _ = require('lodash');
var Promise = require('bluebird');
var express = require('express');
var router = express.Router({mergeParams: true});
var utils = require('./utils');

var Operation = function (name, options, resource) {
    this.operationName = name;
    this.options = options;
    this.resource = resource;

    // expose the method call via this.resource.methodName();
    if (!resource.api[resource.resourceName]) {
        resource.api[resource.resourceName] = {};
    }

    resource.api[resource.resourceName][name] = this.method.bind(this);
};

var proto = Operation.prototype;

proto.router = function () {
    var method = this.options.httpMethod;
    var route = this.options.route;

    router[method](route, this.http());

    return router;
};

proto.internal = function (apiReq, apiRes, cb) {
    var queue = [];
    var model = this.resource.model;
    var method = this.options.modelMethod;
    var allowedParams = this.options.allowedParams;

    function processParams(apiReq, apiRes, apiNext) {
        apiRes.query = _.pick(apiReq.params, allowedParams);
        apiNext();
    }

    function modelCall(apiReq, apiRes, apiNext) {
        return model[method](apiRes.query).then(function (result) {
            apiRes.resultModel = result;
            apiNext();
        });
    }

    function noop(apireq, apiRes, apiNext) {
        apiNext();
    }

    var validate = preFetchPermissions = postFetchPermissions = noop;

    // TODO determine how to manage this list (e.g. before, after hooks, or as a `use()` style
    queue.push(processParams);
    queue.push(validate);
    queue.push(preFetchPermissions);
    queue.push(modelCall);
    queue.push(postFetchPermissions);

    utils.handleQueue(queue, apiReq, apiRes, cb);
};

proto.http = function () {
    var operation = this;

    function convertHTTPToAPI(req, res) {
        var params = req.params;
        var source = req.source;
        var APIRequest = utils.APIRequest(params, source);
        var APIResponse = utils.APIResponse(APIRequest);

        return [APIRequest, APIResponse];
    }

    function convertAPIResultToHTTPResult(apiRes) {
        return {
            model: apiRes.resultModel,
            type: operation.options.resultType
        }
    }

    return function handleHTTP(req, res, next) {
        var args = convertHTTPToAPI(req, res);
        var callback = function callback(apiReq, apiRes) {
            res.apiResult = convertAPIResultToHTTPResult(apiRes);

            return next();
        };

        args.push(callback);

        operation.internal.apply(operation, args);
    };
};

proto.method = function (params, source, options) {
    var operation = this;

    function convertMethodToAPI(params, source, options) {
        var APIRequest = utils.APIRequest(params, source);
        var APIResponse = utils.APIResponse(APIRequest);

        return [APIRequest, APIResponse];
    }

    function convertAPIResultToMethodResult(apiRes) {
        return apiRes.resultModel.toJSON();
    }

    var args = convertMethodToAPI(params, source, options);

    return new Promise(function (resolve) {
        var callback = function (apiReq, apiRes) {
            var result = convertAPIResultToMethodResult(apiRes);
            return resolve(result);
        };

        args.push(callback);

        operation.internal.apply(operation, args);
    });
};


module.exports = Operation;