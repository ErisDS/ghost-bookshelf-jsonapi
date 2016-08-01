/**
 * Provide basic BREAD operations for each model
 *
 * These should have before/after hooks, rather than being overriden
 *
 */

/**
 * Notes on bookshelf's default `fetch` takes the following:
 * @param (boolean) require, return an error if no results are found
 * @param (string|string []) columns, the columns to be retrieved
 * @param (Transaction) transacting, use transaction for query
 * @param (string|Object|mixed[]) withRelated, relations to be retrieved with the model.
 * Either one or more relation names or objects mapping relation names to query callbacks.
 */

var bread = function bread(Bookshelf) {

    // 3rd Party jsonapi params plugin, provides `fetchJsonApi` method
    Bookshelf.plugin(require('bookshelf-jsonapi-params'));

    var Model = Bookshelf.Model.extend({

        },
        {
            browse: function browse(options) {
                return this
                    .forge()
                    .fetchJsonApi(options.queryData);
            },

            read: function read(data, options) {
                return this
                // Allowed properties for data is a restricted set of attributes from the model's schema
                    .forge(data)
                    // .fetchJsonApi(options.queryData, false);
                    .fetch(options);
            },

            edit: function edit(data, options) {

            },

            add: function add(data, options) {

            },

            destroy: function destroy(options) {

            }
        });

    Bookshelf.Model = Model;
};

module.exports = bread;