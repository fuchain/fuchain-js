"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = sanitize;var _includes = _interopRequireDefault(require("core-js/library/fn/array/includes"));
var _entries = _interopRequireDefault(require("core-js/library/fn/object/entries"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

/**
                                                                                                                                                                                   * @private
                                                                                                                                                                                   * Abstraction for selectFromObject and omitFromObject for DRYness.
                                                                                                                                                                                   * Set isInclusion to true if the filter should be for including the filtered items (ie. selecting
                                                                                                                                                                                   * only them vs omitting only them).
                                                                                                                                                                                   */
function filterFromObject(obj, filter, { isInclusion = true } = {}) {
  if (filter && Array.isArray(filter)) {
    return applyFilterOnObject(
    obj,
    isInclusion ?
    (_, key) => (0, _includes.default)(filter, key) :
    (_, key) => !(0, _includes.default)(filter, key));

  } else if (filter && typeof filter === "function") {
    // Flip the filter fn's return if it's for inclusion
    return applyFilterOnObject(
    obj,
    isInclusion ? filter : (...args) => !filter(...args));

  } else {
    throw new Error(
    "The given filter is not an array or function. Exclude aborted");

  }
}

/**
   * @private
   * Returns a filtered copy of the given object's own enumerable properties (no inherited
   * properties), keeping any keys that pass the given filter function.
   */
function applyFilterOnObject(obj, filterFn) {
  if (filterFn == null) {
    return Object.assign({}, obj);
  }

  const filteredObj = {};
  (0, _entries.default)(obj).forEach(([key, val]) => {
    if (filterFn(val, key)) {
      filteredObj[key] = val;
    }
  });

  return filteredObj;
}

/**
   * @private
   * Similar to lodash's _.pick(), this returns a copy of the given object's
   * own and inherited enumerable properties, selecting only the keys in
   * the given array or whose value pass the given filter function.
   * @param {Object} obj Source object
   * @param {Array|function} filter Array of key names to select or function to invoke per iteration
   * @return {Object} The new object
   */
function selectFromObject(obj, filter) {
  return filterFromObject(obj, filter);
}

/**
   * @private
   * Glorified selectFromObject. Takes an object and returns a filtered shallow copy that strips out
   * any properties that are falsy (including coercions, ie. undefined, null, '', 0, ...).
   * Does not modify the passed in object.
   *
   * @param {Object} obj Javascript object
   * @return {Object} Sanitized Javascript object
   */
function sanitize(obj) {
  return selectFromObject(obj, val => !!val);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zYW5pdGl6ZS5qcyJdLCJuYW1lcyI6WyJmaWx0ZXJGcm9tT2JqZWN0Iiwib2JqIiwiZmlsdGVyIiwiaXNJbmNsdXNpb24iLCJBcnJheSIsImlzQXJyYXkiLCJhcHBseUZpbHRlck9uT2JqZWN0IiwiXyIsImtleSIsImFyZ3MiLCJFcnJvciIsImZpbHRlckZuIiwiT2JqZWN0IiwiYXNzaWduIiwiZmlsdGVyZWRPYmoiLCJmb3JFYWNoIiwidmFsIiwic2VsZWN0RnJvbU9iamVjdCIsInNhbml0aXplIl0sIm1hcHBpbmdzIjoic0dBQUE7QUFDQSxvRjs7QUFFQTs7Ozs7O0FBTUEsU0FBU0EsZ0JBQVQsQ0FBMEJDLEdBQTFCLEVBQStCQyxNQUEvQixFQUF1QyxFQUFFQyxXQUFXLEdBQUcsSUFBaEIsS0FBeUIsRUFBaEUsRUFBb0U7QUFDaEUsTUFBSUQsTUFBTSxJQUFJRSxLQUFLLENBQUNDLE9BQU4sQ0FBY0gsTUFBZCxDQUFkLEVBQXFDO0FBQ2pDLFdBQU9JLG1CQUFtQjtBQUN0QkwsSUFBQUEsR0FEc0I7QUFFdEJFLElBQUFBLFdBQVc7QUFDTCxLQUFDSSxDQUFELEVBQUlDLEdBQUosS0FBWSx1QkFBYU4sTUFBYixFQUFxQk0sR0FBckIsQ0FEUDtBQUVMLEtBQUNELENBQUQsRUFBSUMsR0FBSixLQUFZLENBQUMsdUJBQWFOLE1BQWIsRUFBcUJNLEdBQXJCLENBSkcsQ0FBMUI7O0FBTUgsR0FQRCxNQU9PLElBQUlOLE1BQU0sSUFBSSxPQUFPQSxNQUFQLEtBQWtCLFVBQWhDLEVBQTRDO0FBQy9DO0FBQ0EsV0FBT0ksbUJBQW1CO0FBQ3RCTCxJQUFBQSxHQURzQjtBQUV0QkUsSUFBQUEsV0FBVyxHQUFHRCxNQUFILEdBQVksQ0FBQyxHQUFHTyxJQUFKLEtBQWEsQ0FBQ1AsTUFBTSxDQUFDLEdBQUdPLElBQUosQ0FGckIsQ0FBMUI7O0FBSUgsR0FOTSxNQU1BO0FBQ0gsVUFBTSxJQUFJQyxLQUFKO0FBQ0YsbUVBREUsQ0FBTjs7QUFHSDtBQUNKOztBQUVEOzs7OztBQUtBLFNBQVNKLG1CQUFULENBQTZCTCxHQUE3QixFQUFrQ1UsUUFBbEMsRUFBNEM7QUFDeEMsTUFBSUEsUUFBUSxJQUFJLElBQWhCLEVBQXNCO0FBQ2xCLFdBQU9DLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JaLEdBQWxCLENBQVA7QUFDSDs7QUFFRCxRQUFNYSxXQUFXLEdBQUcsRUFBcEI7QUFDQSx3QkFBa0JiLEdBQWxCLEVBQXVCYyxPQUF2QixDQUErQixDQUFDLENBQUNQLEdBQUQsRUFBTVEsR0FBTixDQUFELEtBQWdCO0FBQzNDLFFBQUlMLFFBQVEsQ0FBQ0ssR0FBRCxFQUFNUixHQUFOLENBQVosRUFBd0I7QUFDcEJNLE1BQUFBLFdBQVcsQ0FBQ04sR0FBRCxDQUFYLEdBQW1CUSxHQUFuQjtBQUNIO0FBQ0osR0FKRDs7QUFNQSxTQUFPRixXQUFQO0FBQ0g7O0FBRUQ7Ozs7Ozs7OztBQVNBLFNBQVNHLGdCQUFULENBQTBCaEIsR0FBMUIsRUFBK0JDLE1BQS9CLEVBQXVDO0FBQ25DLFNBQU9GLGdCQUFnQixDQUFDQyxHQUFELEVBQU1DLE1BQU4sQ0FBdkI7QUFDSDs7QUFFRDs7Ozs7Ozs7O0FBU2UsU0FBU2dCLFFBQVQsQ0FBa0JqQixHQUFsQixFQUF1QjtBQUNsQyxTQUFPZ0IsZ0JBQWdCLENBQUNoQixHQUFELEVBQU1lLEdBQUcsSUFBSSxDQUFDLENBQUNBLEdBQWYsQ0FBdkI7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjb3JlSW5jbHVkZXMgZnJvbSBcImNvcmUtanMvbGlicmFyeS9mbi9hcnJheS9pbmNsdWRlc1wiO1xuaW1wb3J0IGNvcmVPYmplY3RFbnRyaWVzIGZyb20gXCJjb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2VudHJpZXNcIjtcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQWJzdHJhY3Rpb24gZm9yIHNlbGVjdEZyb21PYmplY3QgYW5kIG9taXRGcm9tT2JqZWN0IGZvciBEUlluZXNzLlxuICogU2V0IGlzSW5jbHVzaW9uIHRvIHRydWUgaWYgdGhlIGZpbHRlciBzaG91bGQgYmUgZm9yIGluY2x1ZGluZyB0aGUgZmlsdGVyZWQgaXRlbXMgKGllLiBzZWxlY3RpbmdcbiAqIG9ubHkgdGhlbSB2cyBvbWl0dGluZyBvbmx5IHRoZW0pLlxuICovXG5mdW5jdGlvbiBmaWx0ZXJGcm9tT2JqZWN0KG9iaiwgZmlsdGVyLCB7IGlzSW5jbHVzaW9uID0gdHJ1ZSB9ID0ge30pIHtcbiAgICBpZiAoZmlsdGVyICYmIEFycmF5LmlzQXJyYXkoZmlsdGVyKSkge1xuICAgICAgICByZXR1cm4gYXBwbHlGaWx0ZXJPbk9iamVjdChcbiAgICAgICAgICAgIG9iaixcbiAgICAgICAgICAgIGlzSW5jbHVzaW9uXG4gICAgICAgICAgICAgICAgPyAoXywga2V5KSA9PiBjb3JlSW5jbHVkZXMoZmlsdGVyLCBrZXkpXG4gICAgICAgICAgICAgICAgOiAoXywga2V5KSA9PiAhY29yZUluY2x1ZGVzKGZpbHRlciwga2V5KVxuICAgICAgICApO1xuICAgIH0gZWxzZSBpZiAoZmlsdGVyICYmIHR5cGVvZiBmaWx0ZXIgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAvLyBGbGlwIHRoZSBmaWx0ZXIgZm4ncyByZXR1cm4gaWYgaXQncyBmb3IgaW5jbHVzaW9uXG4gICAgICAgIHJldHVybiBhcHBseUZpbHRlck9uT2JqZWN0KFxuICAgICAgICAgICAgb2JqLFxuICAgICAgICAgICAgaXNJbmNsdXNpb24gPyBmaWx0ZXIgOiAoLi4uYXJncykgPT4gIWZpbHRlciguLi5hcmdzKVxuICAgICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIFwiVGhlIGdpdmVuIGZpbHRlciBpcyBub3QgYW4gYXJyYXkgb3IgZnVuY3Rpb24uIEV4Y2x1ZGUgYWJvcnRlZFwiXG4gICAgICAgICk7XG4gICAgfVxufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBSZXR1cm5zIGEgZmlsdGVyZWQgY29weSBvZiB0aGUgZ2l2ZW4gb2JqZWN0J3Mgb3duIGVudW1lcmFibGUgcHJvcGVydGllcyAobm8gaW5oZXJpdGVkXG4gKiBwcm9wZXJ0aWVzKSwga2VlcGluZyBhbnkga2V5cyB0aGF0IHBhc3MgdGhlIGdpdmVuIGZpbHRlciBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYXBwbHlGaWx0ZXJPbk9iamVjdChvYmosIGZpbHRlckZuKSB7XG4gICAgaWYgKGZpbHRlckZuID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIG9iaik7XG4gICAgfVxuXG4gICAgY29uc3QgZmlsdGVyZWRPYmogPSB7fTtcbiAgICBjb3JlT2JqZWN0RW50cmllcyhvYmopLmZvckVhY2goKFtrZXksIHZhbF0pID0+IHtcbiAgICAgICAgaWYgKGZpbHRlckZuKHZhbCwga2V5KSkge1xuICAgICAgICAgICAgZmlsdGVyZWRPYmpba2V5XSA9IHZhbDtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGZpbHRlcmVkT2JqO1xufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBTaW1pbGFyIHRvIGxvZGFzaCdzIF8ucGljaygpLCB0aGlzIHJldHVybnMgYSBjb3B5IG9mIHRoZSBnaXZlbiBvYmplY3Qnc1xuICogb3duIGFuZCBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0aWVzLCBzZWxlY3Rpbmcgb25seSB0aGUga2V5cyBpblxuICogdGhlIGdpdmVuIGFycmF5IG9yIHdob3NlIHZhbHVlIHBhc3MgdGhlIGdpdmVuIGZpbHRlciBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogU291cmNlIG9iamVjdFxuICogQHBhcmFtIHtBcnJheXxmdW5jdGlvbn0gZmlsdGVyIEFycmF5IG9mIGtleSBuYW1lcyB0byBzZWxlY3Qgb3IgZnVuY3Rpb24gdG8gaW52b2tlIHBlciBpdGVyYXRpb25cbiAqIEByZXR1cm4ge09iamVjdH0gVGhlIG5ldyBvYmplY3RcbiAqL1xuZnVuY3Rpb24gc2VsZWN0RnJvbU9iamVjdChvYmosIGZpbHRlcikge1xuICAgIHJldHVybiBmaWx0ZXJGcm9tT2JqZWN0KG9iaiwgZmlsdGVyKTtcbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogR2xvcmlmaWVkIHNlbGVjdEZyb21PYmplY3QuIFRha2VzIGFuIG9iamVjdCBhbmQgcmV0dXJucyBhIGZpbHRlcmVkIHNoYWxsb3cgY29weSB0aGF0IHN0cmlwcyBvdXRcbiAqIGFueSBwcm9wZXJ0aWVzIHRoYXQgYXJlIGZhbHN5IChpbmNsdWRpbmcgY29lcmNpb25zLCBpZS4gdW5kZWZpbmVkLCBudWxsLCAnJywgMCwgLi4uKS5cbiAqIERvZXMgbm90IG1vZGlmeSB0aGUgcGFzc2VkIGluIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIEphdmFzY3JpcHQgb2JqZWN0XG4gKiBAcmV0dXJuIHtPYmplY3R9IFNhbml0aXplZCBKYXZhc2NyaXB0IG9iamVjdFxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzYW5pdGl6ZShvYmopIHtcbiAgICByZXR1cm4gc2VsZWN0RnJvbU9iamVjdChvYmosIHZhbCA9PiAhIXZhbCk7XG59XG4iXX0=