"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = sha256Hash;var _jsSha = _interopRequireDefault(require("js-sha3"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

function sha256Hash(data) {
  return _jsSha.default.sha3_256.
  create().
  update(data).
  hex();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zaGEyNTZIYXNoLmpzIl0sIm5hbWVzIjpbInNoYTI1Nkhhc2giLCJkYXRhIiwic2hhMyIsInNoYTNfMjU2IiwiY3JlYXRlIiwidXBkYXRlIiwiaGV4Il0sIm1hcHBpbmdzIjoid0dBQUEsd0Q7O0FBRWUsU0FBU0EsVUFBVCxDQUFvQkMsSUFBcEIsRUFBMEI7QUFDckMsU0FBT0MsZUFBS0MsUUFBTDtBQUNGQyxFQUFBQSxNQURFO0FBRUZDLEVBQUFBLE1BRkUsQ0FFS0osSUFGTDtBQUdGSyxFQUFBQSxHQUhFLEVBQVA7QUFJSCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBzaGEzIGZyb20gXCJqcy1zaGEzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNoYTI1Nkhhc2goZGF0YSkge1xuICAgIHJldHVybiBzaGEzLnNoYTNfMjU2XG4gICAgICAgIC5jcmVhdGUoKVxuICAgICAgICAudXBkYXRlKGRhdGEpXG4gICAgICAgIC5oZXgoKTtcbn1cbiJdfQ==