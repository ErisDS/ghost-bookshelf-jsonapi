# Ghost Bookshelf JSONAPI

This module abstracts away the logic around a JSONAPI endpoint
It requires configuration, but otherwise can figure out how to glue a 
JSONAPI compliant API together from bookshelf all on its own.

It's supposed to be a little bit magical - write it once, and we can reuse 
it anywhere we want a JSONAPI built on top of bookshelf (e.g. Daisy.js)

It borrows some code patterns from express and would probably benefit
heavily from being transpiled from ES6 so we can use classes?

## Code structure

- `/lib` - most of the important code is here
    - `bookshelf-jsonapi.js` - main entry point
    - `api.js` - API object
    - `resource.js` - resource object
    - `operation.js` - operation object
    - `utils.js` - other stuff
    - `/middleware` - things which may or may not make sense as express middleware
    
Note: we should probably have a concept of `apiware` functions. That is
middlewareish functions which can be used in the internal queue system.