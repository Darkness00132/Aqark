/**
 * Wraps an async Express route handler and forwards errors to next()
 */
function asyncHandler(fn) {
    return function (req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
export default asyncHandler;
