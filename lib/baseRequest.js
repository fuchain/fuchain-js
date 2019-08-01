"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = baseRequest;var _es6Promise = require("es6-promise");
var _fetchPonyfill = _interopRequireDefault(require("fetch-ponyfill"));
var _sprintfJs = require("sprintf-js");

var _format_text = _interopRequireDefault(require("./format_text"));
var _stringify_as_query_param = _interopRequireDefault(require("./stringify_as_query_param"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const fetch = (0, _fetchPonyfill.default)(_es6Promise.Promise);

/**
                                                                 * @private
                                                                 * imported from https://github.com/bigchaindb/js-utility-belt/
                                                                 *
                                                                 * Global fetch wrapper that adds some basic error handling and ease of use enhancements.
                                                                 * Considers any non-2xx response as an error.
                                                                 *
                                                                 * For more information on fetch, see https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch.
                                                                 *
                                                                 * Expects fetch to already be available (either in a ES6 environment, bundled through webpack, or
                                                                 * injected through a polyfill).
                                                                 *
                                                                 * @param  {string}  url    Url to request. Can be specified as a sprintf format string (see
                                                                 *                          https://github.com/alexei/sprintf.js) that will be resolved using
                                                                 *                          `config.urlTemplateSpec`.
                                                                 * @param  {Object}  config Additional configuration, mostly passed to fetch as its 'init' config
                                                                 *                          (see https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch#Parameters).
                                                                 * @param  {*}             config.jsonBody        Json payload to the request. Will automatically be
                                                                 *                                                JSON.stringify()-ed and override `config.body`.
                                                                 * @param  {string|Object} config.query           Query parameter to append to the end of the url.
                                                                 *                                                If specified as an object, keys will be
                                                                 *                                                decamelized into snake case first.
                                                                 * @param  {*[]|Object}    config.urlTemplateSpec Format spec to use to expand the url (see sprintf).
                                                                 * @param  {*}             config.*               All other options are passed through to fetch.
                                                                 *
                                                                 * @return {Promise}        Promise that will resolve with the response if its status was 2xx;
                                                                 *                          otherwise rejects with the response
                                                                 */
function baseRequest(
url,
{ jsonBody, query, urlTemplateSpec, ...fetchConfig } = {})
{
  let expandedUrl = url;

  if (urlTemplateSpec != null) {
    if (Array.isArray(urlTemplateSpec) && urlTemplateSpec.length) {
      // Use vsprintf for the array call signature
      expandedUrl = (0, _sprintfJs.vsprintf)(url, urlTemplateSpec);
    } else if (
    urlTemplateSpec &&
    typeof urlTemplateSpec === "object" &&
    Object.keys(urlTemplateSpec).length)
    {
      expandedUrl = (0, _format_text.default)(url, urlTemplateSpec);
    } else if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(
      "Supplied urlTemplateSpec was not an array or object. Ignoring...");

    }
  }

  if (query != null) {
    if (typeof query === "string") {
      expandedUrl += query;
    } else if (query && typeof query === "object") {
      expandedUrl += (0, _stringify_as_query_param.default)(query);
    } else if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(
      "Supplied query was not a string or object. Ignoring...");

    }
  }

  if (jsonBody != null) {
    fetchConfig.body = JSON.stringify(jsonBody);
  }

  return fetch.fetch(expandedUrl, fetchConfig).then(res => {
    // If status is not a 2xx (based on Response.ok), assume it's an error
    // See https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch
    if (!(res && res.ok)) {
      const errorObject = {
        message: "HTTP Error: Requested page not reachable",
        status: `${res.status} ${res.statusText}`,
        requestURI: res.url };

      throw errorObject;
    }
    return res;
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9iYXNlUmVxdWVzdC5qcyJdLCJuYW1lcyI6WyJmZXRjaCIsIlByb21pc2UiLCJiYXNlUmVxdWVzdCIsInVybCIsImpzb25Cb2R5IiwicXVlcnkiLCJ1cmxUZW1wbGF0ZVNwZWMiLCJmZXRjaENvbmZpZyIsImV4cGFuZGVkVXJsIiwiQXJyYXkiLCJpc0FycmF5IiwibGVuZ3RoIiwiT2JqZWN0Iiwia2V5cyIsInByb2Nlc3MiLCJlbnYiLCJOT0RFX0VOViIsImNvbnNvbGUiLCJ3YXJuIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJ0aGVuIiwicmVzIiwib2siLCJlcnJvck9iamVjdCIsIm1lc3NhZ2UiLCJzdGF0dXMiLCJzdGF0dXNUZXh0IiwicmVxdWVzdFVSSSJdLCJtYXBwaW5ncyI6InlHQUFBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhGOztBQUVBLE1BQU1BLEtBQUssR0FBRyw0QkFBY0MsbUJBQWQsQ0FBZDs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTRCZSxTQUFTQyxXQUFUO0FBQ1hDLEdBRFc7QUFFWCxFQUFFQyxRQUFGLEVBQVlDLEtBQVosRUFBbUJDLGVBQW5CLEVBQW9DLEdBQUdDLFdBQXZDLEtBQXVELEVBRjVDO0FBR2I7QUFDRSxNQUFJQyxXQUFXLEdBQUdMLEdBQWxCOztBQUVBLE1BQUlHLGVBQWUsSUFBSSxJQUF2QixFQUE2QjtBQUN6QixRQUFJRyxLQUFLLENBQUNDLE9BQU4sQ0FBY0osZUFBZCxLQUFrQ0EsZUFBZSxDQUFDSyxNQUF0RCxFQUE4RDtBQUMxRDtBQUNBSCxNQUFBQSxXQUFXLEdBQUcseUJBQVNMLEdBQVQsRUFBY0csZUFBZCxDQUFkO0FBQ0gsS0FIRCxNQUdPO0FBQ0hBLElBQUFBLGVBQWU7QUFDZixXQUFPQSxlQUFQLEtBQTJCLFFBRDNCO0FBRUFNLElBQUFBLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZUCxlQUFaLEVBQTZCSyxNQUgxQjtBQUlMO0FBQ0VILE1BQUFBLFdBQVcsR0FBRywwQkFBV0wsR0FBWCxFQUFnQkcsZUFBaEIsQ0FBZDtBQUNILEtBTk0sTUFNQSxJQUFJUSxPQUFPLENBQUNDLEdBQVIsQ0FBWUMsUUFBWixLQUF5QixZQUE3QixFQUEyQztBQUM5QztBQUNBQyxNQUFBQSxPQUFPLENBQUNDLElBQVI7QUFDSSx3RUFESjs7QUFHSDtBQUNKOztBQUVELE1BQUliLEtBQUssSUFBSSxJQUFiLEVBQW1CO0FBQ2YsUUFBSSxPQUFPQSxLQUFQLEtBQWlCLFFBQXJCLEVBQStCO0FBQzNCRyxNQUFBQSxXQUFXLElBQUlILEtBQWY7QUFDSCxLQUZELE1BRU8sSUFBSUEsS0FBSyxJQUFJLE9BQU9BLEtBQVAsS0FBaUIsUUFBOUIsRUFBd0M7QUFDM0NHLE1BQUFBLFdBQVcsSUFBSSx1Q0FBc0JILEtBQXRCLENBQWY7QUFDSCxLQUZNLE1BRUEsSUFBSVMsT0FBTyxDQUFDQyxHQUFSLENBQVlDLFFBQVosS0FBeUIsWUFBN0IsRUFBMkM7QUFDOUM7QUFDQUMsTUFBQUEsT0FBTyxDQUFDQyxJQUFSO0FBQ0ksOERBREo7O0FBR0g7QUFDSjs7QUFFRCxNQUFJZCxRQUFRLElBQUksSUFBaEIsRUFBc0I7QUFDbEJHLElBQUFBLFdBQVcsQ0FBQ1ksSUFBWixHQUFtQkMsSUFBSSxDQUFDQyxTQUFMLENBQWVqQixRQUFmLENBQW5CO0FBQ0g7O0FBRUQsU0FBT0osS0FBSyxDQUFDQSxLQUFOLENBQVlRLFdBQVosRUFBeUJELFdBQXpCLEVBQXNDZSxJQUF0QyxDQUEyQ0MsR0FBRyxJQUFJO0FBQ3JEO0FBQ0E7QUFDQSxRQUFJLEVBQUVBLEdBQUcsSUFBSUEsR0FBRyxDQUFDQyxFQUFiLENBQUosRUFBc0I7QUFDbEIsWUFBTUMsV0FBVyxHQUFHO0FBQ2hCQyxRQUFBQSxPQUFPLEVBQUUsMENBRE87QUFFaEJDLFFBQUFBLE1BQU0sRUFBRyxHQUFFSixHQUFHLENBQUNJLE1BQU8sSUFBR0osR0FBRyxDQUFDSyxVQUFXLEVBRnhCO0FBR2hCQyxRQUFBQSxVQUFVLEVBQUVOLEdBQUcsQ0FBQ3BCLEdBSEEsRUFBcEI7O0FBS0EsWUFBTXNCLFdBQU47QUFDSDtBQUNELFdBQU9GLEdBQVA7QUFDSCxHQVpNLENBQVA7QUFhSCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFByb21pc2UgfSBmcm9tIFwiZXM2LXByb21pc2VcIjtcbmltcG9ydCBmZXRjaFBvbnlmaWxsIGZyb20gXCJmZXRjaC1wb255ZmlsbFwiO1xuaW1wb3J0IHsgdnNwcmludGYgfSBmcm9tIFwic3ByaW50Zi1qc1wiO1xuXG5pbXBvcnQgZm9ybWF0VGV4dCBmcm9tIFwiLi9mb3JtYXRfdGV4dFwiO1xuaW1wb3J0IHN0cmluZ2lmeUFzUXVlcnlQYXJhbSBmcm9tIFwiLi9zdHJpbmdpZnlfYXNfcXVlcnlfcGFyYW1cIjtcblxuY29uc3QgZmV0Y2ggPSBmZXRjaFBvbnlmaWxsKFByb21pc2UpO1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBpbXBvcnRlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9iaWdjaGFpbmRiL2pzLXV0aWxpdHktYmVsdC9cbiAqXG4gKiBHbG9iYWwgZmV0Y2ggd3JhcHBlciB0aGF0IGFkZHMgc29tZSBiYXNpYyBlcnJvciBoYW5kbGluZyBhbmQgZWFzZSBvZiB1c2UgZW5oYW5jZW1lbnRzLlxuICogQ29uc2lkZXJzIGFueSBub24tMnh4IHJlc3BvbnNlIGFzIGFuIGVycm9yLlxuICpcbiAqIEZvciBtb3JlIGluZm9ybWF0aW9uIG9uIGZldGNoLCBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0dsb2JhbEZldGNoL2ZldGNoLlxuICpcbiAqIEV4cGVjdHMgZmV0Y2ggdG8gYWxyZWFkeSBiZSBhdmFpbGFibGUgKGVpdGhlciBpbiBhIEVTNiBlbnZpcm9ubWVudCwgYnVuZGxlZCB0aHJvdWdoIHdlYnBhY2ssIG9yXG4gKiBpbmplY3RlZCB0aHJvdWdoIGEgcG9seWZpbGwpLlxuICpcbiAqIEBwYXJhbSAge3N0cmluZ30gIHVybCAgICBVcmwgdG8gcmVxdWVzdC4gQ2FuIGJlIHNwZWNpZmllZCBhcyBhIHNwcmludGYgZm9ybWF0IHN0cmluZyAoc2VlXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgaHR0cHM6Ly9naXRodWIuY29tL2FsZXhlaS9zcHJpbnRmLmpzKSB0aGF0IHdpbGwgYmUgcmVzb2x2ZWQgdXNpbmdcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICBgY29uZmlnLnVybFRlbXBsYXRlU3BlY2AuXG4gKiBAcGFyYW0gIHtPYmplY3R9ICBjb25maWcgQWRkaXRpb25hbCBjb25maWd1cmF0aW9uLCBtb3N0bHkgcGFzc2VkIHRvIGZldGNoIGFzIGl0cyAnaW5pdCcgY29uZmlnXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgKHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvR2xvYmFsRmV0Y2gvZmV0Y2gjUGFyYW1ldGVycykuXG4gKiBAcGFyYW0gIHsqfSAgICAgICAgICAgICBjb25maWcuanNvbkJvZHkgICAgICAgIEpzb24gcGF5bG9hZCB0byB0aGUgcmVxdWVzdC4gV2lsbCBhdXRvbWF0aWNhbGx5IGJlXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KCktZWQgYW5kIG92ZXJyaWRlIGBjb25maWcuYm9keWAuXG4gKiBAcGFyYW0gIHtzdHJpbmd8T2JqZWN0fSBjb25maWcucXVlcnkgICAgICAgICAgIFF1ZXJ5IHBhcmFtZXRlciB0byBhcHBlbmQgdG8gdGhlIGVuZCBvZiB0aGUgdXJsLlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBJZiBzcGVjaWZpZWQgYXMgYW4gb2JqZWN0LCBrZXlzIHdpbGwgYmVcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVjYW1lbGl6ZWQgaW50byBzbmFrZSBjYXNlIGZpcnN0LlxuICogQHBhcmFtICB7KltdfE9iamVjdH0gICAgY29uZmlnLnVybFRlbXBsYXRlU3BlYyBGb3JtYXQgc3BlYyB0byB1c2UgdG8gZXhwYW5kIHRoZSB1cmwgKHNlZSBzcHJpbnRmKS5cbiAqIEBwYXJhbSAgeyp9ICAgICAgICAgICAgIGNvbmZpZy4qICAgICAgICAgICAgICAgQWxsIG90aGVyIG9wdGlvbnMgYXJlIHBhc3NlZCB0aHJvdWdoIHRvIGZldGNoLlxuICpcbiAqIEByZXR1cm4ge1Byb21pc2V9ICAgICAgICBQcm9taXNlIHRoYXQgd2lsbCByZXNvbHZlIHdpdGggdGhlIHJlc3BvbnNlIGlmIGl0cyBzdGF0dXMgd2FzIDJ4eDtcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICBvdGhlcndpc2UgcmVqZWN0cyB3aXRoIHRoZSByZXNwb25zZVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBiYXNlUmVxdWVzdChcbiAgICB1cmwsXG4gICAgeyBqc29uQm9keSwgcXVlcnksIHVybFRlbXBsYXRlU3BlYywgLi4uZmV0Y2hDb25maWcgfSA9IHt9XG4pIHtcbiAgICBsZXQgZXhwYW5kZWRVcmwgPSB1cmw7XG5cbiAgICBpZiAodXJsVGVtcGxhdGVTcGVjICE9IG51bGwpIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodXJsVGVtcGxhdGVTcGVjKSAmJiB1cmxUZW1wbGF0ZVNwZWMubGVuZ3RoKSB7XG4gICAgICAgICAgICAvLyBVc2UgdnNwcmludGYgZm9yIHRoZSBhcnJheSBjYWxsIHNpZ25hdHVyZVxuICAgICAgICAgICAgZXhwYW5kZWRVcmwgPSB2c3ByaW50Zih1cmwsIHVybFRlbXBsYXRlU3BlYyk7XG4gICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICB1cmxUZW1wbGF0ZVNwZWMgJiZcbiAgICAgICAgICAgIHR5cGVvZiB1cmxUZW1wbGF0ZVNwZWMgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHVybFRlbXBsYXRlU3BlYykubGVuZ3RoXG4gICAgICAgICkge1xuICAgICAgICAgICAgZXhwYW5kZWRVcmwgPSBmb3JtYXRUZXh0KHVybCwgdXJsVGVtcGxhdGVTcGVjKTtcbiAgICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgICAgICAgXCJTdXBwbGllZCB1cmxUZW1wbGF0ZVNwZWMgd2FzIG5vdCBhbiBhcnJheSBvciBvYmplY3QuIElnbm9yaW5nLi4uXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocXVlcnkgIT0gbnVsbCkge1xuICAgICAgICBpZiAodHlwZW9mIHF1ZXJ5ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBleHBhbmRlZFVybCArPSBxdWVyeTtcbiAgICAgICAgfSBlbHNlIGlmIChxdWVyeSAmJiB0eXBlb2YgcXVlcnkgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgIGV4cGFuZGVkVXJsICs9IHN0cmluZ2lmeUFzUXVlcnlQYXJhbShxdWVyeSk7XG4gICAgICAgIH0gZWxzZSBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICAgICAgIFwiU3VwcGxpZWQgcXVlcnkgd2FzIG5vdCBhIHN0cmluZyBvciBvYmplY3QuIElnbm9yaW5nLi4uXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoanNvbkJvZHkgIT0gbnVsbCkge1xuICAgICAgICBmZXRjaENvbmZpZy5ib2R5ID0gSlNPTi5zdHJpbmdpZnkoanNvbkJvZHkpO1xuICAgIH1cblxuICAgIHJldHVybiBmZXRjaC5mZXRjaChleHBhbmRlZFVybCwgZmV0Y2hDb25maWcpLnRoZW4ocmVzID0+IHtcbiAgICAgICAgLy8gSWYgc3RhdHVzIGlzIG5vdCBhIDJ4eCAoYmFzZWQgb24gUmVzcG9uc2Uub2spLCBhc3N1bWUgaXQncyBhbiBlcnJvclxuICAgICAgICAvLyBTZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0dsb2JhbEZldGNoL2ZldGNoXG4gICAgICAgIGlmICghKHJlcyAmJiByZXMub2spKSB7XG4gICAgICAgICAgICBjb25zdCBlcnJvck9iamVjdCA9IHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkhUVFAgRXJyb3I6IFJlcXVlc3RlZCBwYWdlIG5vdCByZWFjaGFibGVcIixcbiAgICAgICAgICAgICAgICBzdGF0dXM6IGAke3Jlcy5zdGF0dXN9ICR7cmVzLnN0YXR1c1RleHR9YCxcbiAgICAgICAgICAgICAgICByZXF1ZXN0VVJJOiByZXMudXJsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhyb3cgZXJyb3JPYmplY3Q7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9KTtcbn1cbiJdfQ==