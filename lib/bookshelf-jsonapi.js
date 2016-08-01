/**
 * Heavily borrowed from express
 */

var API = require('./api');
var mixin = require('merge-descriptors');

function createAPI(url) {
    var api = function () {};

    mixin(api, API, false);

    api.url(url);
    api.init();

    return api;
}

exports = module.exports = createAPI;

// Export the bookshelf plugin (temporary?)
exports.plugin = require('../bookshelf-plugin');