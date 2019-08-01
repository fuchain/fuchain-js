"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = request;var _baseRequest = _interopRequireDefault(require("./baseRequest"));
var _sanitize = _interopRequireDefault(require("./sanitize"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const DEFAULT_REQUEST_CONFIG = {
  headers: {
    Accept: "application/json" } };



/**
                                     * @private
                                     * Small wrapper around js-utility-belt's request that provides url resolving,
                                     * default settings, and response handling.
                                     */
function request(url, config = {}) {
  // Load default fetch configuration and remove any falsy query parameters
  const requestConfig = Object.assign({}, DEFAULT_REQUEST_CONFIG, config, {
    query: config.query && (0, _sanitize.default)(config.query) });

  const apiUrl = url;

  if (requestConfig.jsonBody) {
    requestConfig.headers = Object.assign({}, requestConfig.headers, {
      "Content-Type": "application/json" });

  }

  if (!url) {
    return Promise.reject(new Error("Request was not given a url."));
  }

  return (0, _baseRequest.default)(apiUrl, requestConfig).
  then(res => res.json()).
  catch(err => {
    console.error(err);
    throw err;
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yZXF1ZXN0LmpzIl0sIm5hbWVzIjpbIkRFRkFVTFRfUkVRVUVTVF9DT05GSUciLCJoZWFkZXJzIiwiQWNjZXB0IiwicmVxdWVzdCIsInVybCIsImNvbmZpZyIsInJlcXVlc3RDb25maWciLCJPYmplY3QiLCJhc3NpZ24iLCJxdWVyeSIsImFwaVVybCIsImpzb25Cb2R5IiwiUHJvbWlzZSIsInJlamVjdCIsIkVycm9yIiwidGhlbiIsInJlcyIsImpzb24iLCJjYXRjaCIsImVyciIsImNvbnNvbGUiLCJlcnJvciJdLCJtYXBwaW5ncyI6InFHQUFBO0FBQ0EsOEQ7O0FBRUEsTUFBTUEsc0JBQXNCLEdBQUc7QUFDM0JDLEVBQUFBLE9BQU8sRUFBRTtBQUNMQyxJQUFBQSxNQUFNLEVBQUUsa0JBREgsRUFEa0IsRUFBL0I7Ozs7QUFNQTs7Ozs7QUFLZSxTQUFTQyxPQUFULENBQWlCQyxHQUFqQixFQUFzQkMsTUFBTSxHQUFHLEVBQS9CLEVBQW1DO0FBQzlDO0FBQ0EsUUFBTUMsYUFBYSxHQUFHQyxNQUFNLENBQUNDLE1BQVAsQ0FBYyxFQUFkLEVBQWtCUixzQkFBbEIsRUFBMENLLE1BQTFDLEVBQWtEO0FBQ3BFSSxJQUFBQSxLQUFLLEVBQUVKLE1BQU0sQ0FBQ0ksS0FBUCxJQUFnQix1QkFBU0osTUFBTSxDQUFDSSxLQUFoQixDQUQ2QyxFQUFsRCxDQUF0Qjs7QUFHQSxRQUFNQyxNQUFNLEdBQUdOLEdBQWY7O0FBRUEsTUFBSUUsYUFBYSxDQUFDSyxRQUFsQixFQUE0QjtBQUN4QkwsSUFBQUEsYUFBYSxDQUFDTCxPQUFkLEdBQXdCTSxNQUFNLENBQUNDLE1BQVAsQ0FBYyxFQUFkLEVBQWtCRixhQUFhLENBQUNMLE9BQWhDLEVBQXlDO0FBQzdELHNCQUFnQixrQkFENkMsRUFBekMsQ0FBeEI7O0FBR0g7O0FBRUQsTUFBSSxDQUFDRyxHQUFMLEVBQVU7QUFDTixXQUFPUSxPQUFPLENBQUNDLE1BQVIsQ0FBZSxJQUFJQyxLQUFKLENBQVUsOEJBQVYsQ0FBZixDQUFQO0FBQ0g7O0FBRUQsU0FBTywwQkFBWUosTUFBWixFQUFvQkosYUFBcEI7QUFDRlMsRUFBQUEsSUFERSxDQUNHQyxHQUFHLElBQUlBLEdBQUcsQ0FBQ0MsSUFBSixFQURWO0FBRUZDLEVBQUFBLEtBRkUsQ0FFSUMsR0FBRyxJQUFJO0FBQ1ZDLElBQUFBLE9BQU8sQ0FBQ0MsS0FBUixDQUFjRixHQUFkO0FBQ0EsVUFBTUEsR0FBTjtBQUNILEdBTEUsQ0FBUDtBQU1IIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJhc2VSZXF1ZXN0IGZyb20gXCIuL2Jhc2VSZXF1ZXN0XCI7XG5pbXBvcnQgc2FuaXRpemUgZnJvbSBcIi4vc2FuaXRpemVcIjtcblxuY29uc3QgREVGQVVMVF9SRVFVRVNUX0NPTkZJRyA9IHtcbiAgICBoZWFkZXJzOiB7XG4gICAgICAgIEFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCJcbiAgICB9XG59O1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBTbWFsbCB3cmFwcGVyIGFyb3VuZCBqcy11dGlsaXR5LWJlbHQncyByZXF1ZXN0IHRoYXQgcHJvdmlkZXMgdXJsIHJlc29sdmluZyxcbiAqIGRlZmF1bHQgc2V0dGluZ3MsIGFuZCByZXNwb25zZSBoYW5kbGluZy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVxdWVzdCh1cmwsIGNvbmZpZyA9IHt9KSB7XG4gICAgLy8gTG9hZCBkZWZhdWx0IGZldGNoIGNvbmZpZ3VyYXRpb24gYW5kIHJlbW92ZSBhbnkgZmFsc3kgcXVlcnkgcGFyYW1ldGVyc1xuICAgIGNvbnN0IHJlcXVlc3RDb25maWcgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX1JFUVVFU1RfQ09ORklHLCBjb25maWcsIHtcbiAgICAgICAgcXVlcnk6IGNvbmZpZy5xdWVyeSAmJiBzYW5pdGl6ZShjb25maWcucXVlcnkpXG4gICAgfSk7XG4gICAgY29uc3QgYXBpVXJsID0gdXJsO1xuXG4gICAgaWYgKHJlcXVlc3RDb25maWcuanNvbkJvZHkpIHtcbiAgICAgICAgcmVxdWVzdENvbmZpZy5oZWFkZXJzID0gT2JqZWN0LmFzc2lnbih7fSwgcmVxdWVzdENvbmZpZy5oZWFkZXJzLCB7XG4gICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoIXVybCkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiUmVxdWVzdCB3YXMgbm90IGdpdmVuIGEgdXJsLlwiKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJhc2VSZXF1ZXN0KGFwaVVybCwgcmVxdWVzdENvbmZpZylcbiAgICAgICAgLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9KTtcbn1cbiJdfQ==