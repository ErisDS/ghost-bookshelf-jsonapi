function handleQueue(queue, apiReq, apiRes, cb) {
    var idx = 0;
    apiNext();

    function apiNext() {
        var nextFunc = queue[idx];
        idx += 1;

        if (!nextFunc) {
            return cb(apiReq, apiRes);
        }

        return nextFunc(apiReq, apiRes, apiNext);
    }
}

// TODO: probably turn these into proper objects
function APIRequest(params, source) {
    return {
        resource: '',
        operation: '',
        httpMethod: '',
        modelMethod: '',
        route: '',
        source: source,
        params: params
    };
}

function APIResponse(request) {
    return {
        request: request,
        query: {},
        resultModel: {}
    };
}

module.exports.handleQueue = handleQueue;
module.exports.APIRequest = APIRequest;
module.exports.APIResponse = APIResponse;
