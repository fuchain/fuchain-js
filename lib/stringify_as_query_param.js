"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = stringifyAsQueryParam;var _entries = _interopRequireDefault(require("core-js/library/fn/object/entries"));
var _decamelize = _interopRequireDefault(require("decamelize"));
var _queryString = _interopRequireDefault(require("query-string"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

/**
                                                                                                                                                                  * @private
                                                                                                                                                                  * imported from https://github.com/bigchaindb/js-utility-belt/
                                                                                                                                                                  *
                                                                                                                                                                  * Takes a key-value dictionary (ie. object) and converts it to a query-parameter string that you
                                                                                                                                                                  * can directly append into a URL.
                                                                                                                                                                  *
                                                                                                                                                                  * Extends queryString.stringify by allowing you to specify a `transform` function that will be
                                                                                                                                                                  * invoked on each of the dictionary's keys before being stringified into the query-parameter
                                                                                                                                                                  * string.
                                                                                                                                                                  *
                                                                                                                                                                  * By default `transform` is `decamelize`, so a dictionary of the form:
                                                                                                                                                                  *
                                                                                                                                                                  *   {
                                                                                                                                                                  *      page: 1,
                                                                                                                                                                  *      pageSize: 10
                                                                                                                                                                  *   }
                                                                                                                                                                  *
                                                                                                                                                                  * will be converted to a string like:
                                                                                                                                                                  *
                                                                                                                                                                  *   ?page=1&page_size=10
                                                                                                                                                                  *
                                                                                                                                                                  * @param  {Object}   obj                    Query params dictionary
                                                                                                                                                                  * @param  {function} [transform=decamelize] Transform function for each of the param keys
                                                                                                                                                                  * @return {string}                          Query param string
                                                                                                                                                                  */
function stringifyAsQueryParam(obj, transform = _decamelize.default) {
  if (!obj || typeof obj !== "object" || !Object.keys(obj).length) {
    return "";
  }

  const transformedKeysObj = (0, _entries.default)(obj).reduce(
  (paramsObj, [key, value]) => {
    paramsObj[transform(key)] = value;
    return paramsObj;
  },
  {});


  return `?${_queryString.default.stringify(transformedKeysObj)}`;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zdHJpbmdpZnlfYXNfcXVlcnlfcGFyYW0uanMiXSwibmFtZXMiOlsic3RyaW5naWZ5QXNRdWVyeVBhcmFtIiwib2JqIiwidHJhbnNmb3JtIiwiZGVjYW1lbGl6ZSIsIk9iamVjdCIsImtleXMiLCJsZW5ndGgiLCJ0cmFuc2Zvcm1lZEtleXNPYmoiLCJyZWR1Y2UiLCJwYXJhbXNPYmoiLCJrZXkiLCJ2YWx1ZSIsInF1ZXJ5U3RyaW5nIiwic3RyaW5naWZ5Il0sIm1hcHBpbmdzIjoibUhBQUE7QUFDQTtBQUNBLG1FOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCZSxTQUFTQSxxQkFBVCxDQUErQkMsR0FBL0IsRUFBb0NDLFNBQVMsR0FBR0MsbUJBQWhELEVBQTREO0FBQ3ZFLE1BQUksQ0FBQ0YsR0FBRCxJQUFRLE9BQU9BLEdBQVAsS0FBZSxRQUF2QixJQUFtQyxDQUFDRyxNQUFNLENBQUNDLElBQVAsQ0FBWUosR0FBWixFQUFpQkssTUFBekQsRUFBaUU7QUFDN0QsV0FBTyxFQUFQO0FBQ0g7O0FBRUQsUUFBTUMsa0JBQWtCLEdBQUcsc0JBQWtCTixHQUFsQixFQUF1Qk8sTUFBdkI7QUFDdkIsR0FBQ0MsU0FBRCxFQUFZLENBQUNDLEdBQUQsRUFBTUMsS0FBTixDQUFaLEtBQTZCO0FBQ3pCRixJQUFBQSxTQUFTLENBQUNQLFNBQVMsQ0FBQ1EsR0FBRCxDQUFWLENBQVQsR0FBNEJDLEtBQTVCO0FBQ0EsV0FBT0YsU0FBUDtBQUNILEdBSnNCO0FBS3ZCLElBTHVCLENBQTNCOzs7QUFRQSxTQUFRLElBQUdHLHFCQUFZQyxTQUFaLENBQXNCTixrQkFBdEIsQ0FBMEMsRUFBckQ7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjb3JlT2JqZWN0RW50cmllcyBmcm9tIFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9lbnRyaWVzXCI7XG5pbXBvcnQgZGVjYW1lbGl6ZSBmcm9tIFwiZGVjYW1lbGl6ZVwiO1xuaW1wb3J0IHF1ZXJ5U3RyaW5nIGZyb20gXCJxdWVyeS1zdHJpbmdcIjtcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogaW1wb3J0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vYmlnY2hhaW5kYi9qcy11dGlsaXR5LWJlbHQvXG4gKlxuICogVGFrZXMgYSBrZXktdmFsdWUgZGljdGlvbmFyeSAoaWUuIG9iamVjdCkgYW5kIGNvbnZlcnRzIGl0IHRvIGEgcXVlcnktcGFyYW1ldGVyIHN0cmluZyB0aGF0IHlvdVxuICogY2FuIGRpcmVjdGx5IGFwcGVuZCBpbnRvIGEgVVJMLlxuICpcbiAqIEV4dGVuZHMgcXVlcnlTdHJpbmcuc3RyaW5naWZ5IGJ5IGFsbG93aW5nIHlvdSB0byBzcGVjaWZ5IGEgYHRyYW5zZm9ybWAgZnVuY3Rpb24gdGhhdCB3aWxsIGJlXG4gKiBpbnZva2VkIG9uIGVhY2ggb2YgdGhlIGRpY3Rpb25hcnkncyBrZXlzIGJlZm9yZSBiZWluZyBzdHJpbmdpZmllZCBpbnRvIHRoZSBxdWVyeS1wYXJhbWV0ZXJcbiAqIHN0cmluZy5cbiAqXG4gKiBCeSBkZWZhdWx0IGB0cmFuc2Zvcm1gIGlzIGBkZWNhbWVsaXplYCwgc28gYSBkaWN0aW9uYXJ5IG9mIHRoZSBmb3JtOlxuICpcbiAqICAge1xuICogICAgICBwYWdlOiAxLFxuICogICAgICBwYWdlU2l6ZTogMTBcbiAqICAgfVxuICpcbiAqIHdpbGwgYmUgY29udmVydGVkIHRvIGEgc3RyaW5nIGxpa2U6XG4gKlxuICogICA/cGFnZT0xJnBhZ2Vfc2l6ZT0xMFxuICpcbiAqIEBwYXJhbSAge09iamVjdH0gICBvYmogICAgICAgICAgICAgICAgICAgIFF1ZXJ5IHBhcmFtcyBkaWN0aW9uYXJ5XG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gW3RyYW5zZm9ybT1kZWNhbWVsaXplXSBUcmFuc2Zvcm0gZnVuY3Rpb24gZm9yIGVhY2ggb2YgdGhlIHBhcmFtIGtleXNcbiAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgICAgIFF1ZXJ5IHBhcmFtIHN0cmluZ1xuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzdHJpbmdpZnlBc1F1ZXJ5UGFyYW0ob2JqLCB0cmFuc2Zvcm0gPSBkZWNhbWVsaXplKSB7XG4gICAgaWYgKCFvYmogfHwgdHlwZW9mIG9iaiAhPT0gXCJvYmplY3RcIiB8fCAhT2JqZWN0LmtleXMob2JqKS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuXG4gICAgY29uc3QgdHJhbnNmb3JtZWRLZXlzT2JqID0gY29yZU9iamVjdEVudHJpZXMob2JqKS5yZWR1Y2UoXG4gICAgICAgIChwYXJhbXNPYmosIFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICAgICAgcGFyYW1zT2JqW3RyYW5zZm9ybShrZXkpXSA9IHZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuIHBhcmFtc09iajtcbiAgICAgICAgfSxcbiAgICAgICAge31cbiAgICApO1xuXG4gICAgcmV0dXJuIGA/JHtxdWVyeVN0cmluZy5zdHJpbmdpZnkodHJhbnNmb3JtZWRLZXlzT2JqKX1gO1xufVxuIl19