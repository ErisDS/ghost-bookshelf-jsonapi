// Get the formatter
var Mapper = require('jsonapi-mapper'),
    mapper;

function formatter(req, res, next) {
    if (res.apiResult) {
        return res.send(mapper.map(res.apiResult.model, res.apiResult.type));
    }

    return next();
};

module.exports = function (url) {
    if (!mapper) {
        mapper = new Mapper.Bookshelf(url);
    }

    return formatter;
}