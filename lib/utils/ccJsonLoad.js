"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = ccJsonLoad;var _buffer = require("buffer");
var _bs = _interopRequireDefault(require("../bs58"));
var _cryptoConditions = _interopRequireDefault(require("crypto-conditions"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

/**
                                                                                                                                                                            * Loads a crypto-condition class (Fulfillment or Condition) from a BigchainDB JSON object
                                                                                                                                                                            * @param {Object} conditionJson
                                                                                                                                                                            * @returns {cc.Condition} Ed25519 Condition (that will need to wrapped in an Output)
                                                                                                                                                                            */
function ccJsonLoad(conditionJson) {
  if ("hash" in conditionJson) {
    const condition = new _cryptoConditions.default.Condition();
    condition.type = conditionJson.type_id;
    condition.bitmask = conditionJson.bitmask;
    condition.hash = _buffer.Buffer.from(_bs.default.decode(conditionJson.hash));
    condition.maxFulfillmentLength = parseInt(
    conditionJson.max_fulfillment_length,
    10);

    return condition;
  } else {
    let fulfillment;

    if (conditionJson.type === "threshold-sha-256") {
      fulfillment = new _cryptoConditions.default.ThresholdSha256();
      fulfillment.threshold = conditionJson.threshold;
      conditionJson.subconditions.forEach(subconditionJson => {
        const subcondition = ccJsonLoad(subconditionJson);
        if ("getConditionUri" in subcondition) {
          fulfillment.addSubfulfillment(subcondition);
        } else if ("serializeUri" in subcondition) {
          fulfillment.addSubcondition(subcondition);
        }
      });
    }

    if (conditionJson.type === "ed25519-sha-256") {
      fulfillment = new _cryptoConditions.default.Ed25519Sha256();
      fulfillment.publicKey = _buffer.Buffer.from(
      _bs.default.decode(conditionJson.public_key));

    }
    return fulfillment;
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9jY0pzb25Mb2FkLmpzIl0sIm5hbWVzIjpbImNjSnNvbkxvYWQiLCJjb25kaXRpb25Kc29uIiwiY29uZGl0aW9uIiwiY2MiLCJDb25kaXRpb24iLCJ0eXBlIiwidHlwZV9pZCIsImJpdG1hc2siLCJoYXNoIiwiQnVmZmVyIiwiZnJvbSIsImJhc2U1OCIsImRlY29kZSIsIm1heEZ1bGZpbGxtZW50TGVuZ3RoIiwicGFyc2VJbnQiLCJtYXhfZnVsZmlsbG1lbnRfbGVuZ3RoIiwiZnVsZmlsbG1lbnQiLCJUaHJlc2hvbGRTaGEyNTYiLCJ0aHJlc2hvbGQiLCJzdWJjb25kaXRpb25zIiwiZm9yRWFjaCIsInN1YmNvbmRpdGlvbkpzb24iLCJzdWJjb25kaXRpb24iLCJhZGRTdWJmdWxmaWxsbWVudCIsImFkZFN1YmNvbmRpdGlvbiIsIkVkMjU1MTlTaGEyNTYiLCJwdWJsaWNLZXkiLCJwdWJsaWNfa2V5Il0sIm1hcHBpbmdzIjoid0dBQUE7QUFDQTtBQUNBLDZFOztBQUVBOzs7OztBQUtlLFNBQVNBLFVBQVQsQ0FBb0JDLGFBQXBCLEVBQW1DO0FBQzlDLE1BQUksVUFBVUEsYUFBZCxFQUE2QjtBQUN6QixVQUFNQyxTQUFTLEdBQUcsSUFBSUMsMEJBQUdDLFNBQVAsRUFBbEI7QUFDQUYsSUFBQUEsU0FBUyxDQUFDRyxJQUFWLEdBQWlCSixhQUFhLENBQUNLLE9BQS9CO0FBQ0FKLElBQUFBLFNBQVMsQ0FBQ0ssT0FBVixHQUFvQk4sYUFBYSxDQUFDTSxPQUFsQztBQUNBTCxJQUFBQSxTQUFTLENBQUNNLElBQVYsR0FBaUJDLGVBQU9DLElBQVAsQ0FBWUMsWUFBT0MsTUFBUCxDQUFjWCxhQUFhLENBQUNPLElBQTVCLENBQVosQ0FBakI7QUFDQU4sSUFBQUEsU0FBUyxDQUFDVyxvQkFBVixHQUFpQ0MsUUFBUTtBQUNyQ2IsSUFBQUEsYUFBYSxDQUFDYyxzQkFEdUI7QUFFckMsTUFGcUMsQ0FBekM7O0FBSUEsV0FBT2IsU0FBUDtBQUNILEdBVkQsTUFVTztBQUNILFFBQUljLFdBQUo7O0FBRUEsUUFBSWYsYUFBYSxDQUFDSSxJQUFkLEtBQXVCLG1CQUEzQixFQUFnRDtBQUM1Q1csTUFBQUEsV0FBVyxHQUFHLElBQUliLDBCQUFHYyxlQUFQLEVBQWQ7QUFDQUQsTUFBQUEsV0FBVyxDQUFDRSxTQUFaLEdBQXdCakIsYUFBYSxDQUFDaUIsU0FBdEM7QUFDQWpCLE1BQUFBLGFBQWEsQ0FBQ2tCLGFBQWQsQ0FBNEJDLE9BQTVCLENBQW9DQyxnQkFBZ0IsSUFBSTtBQUNwRCxjQUFNQyxZQUFZLEdBQUd0QixVQUFVLENBQUNxQixnQkFBRCxDQUEvQjtBQUNBLFlBQUkscUJBQXFCQyxZQUF6QixFQUF1QztBQUNuQ04sVUFBQUEsV0FBVyxDQUFDTyxpQkFBWixDQUE4QkQsWUFBOUI7QUFDSCxTQUZELE1BRU8sSUFBSSxrQkFBa0JBLFlBQXRCLEVBQW9DO0FBQ3ZDTixVQUFBQSxXQUFXLENBQUNRLGVBQVosQ0FBNEJGLFlBQTVCO0FBQ0g7QUFDSixPQVBEO0FBUUg7O0FBRUQsUUFBSXJCLGFBQWEsQ0FBQ0ksSUFBZCxLQUF1QixpQkFBM0IsRUFBOEM7QUFDMUNXLE1BQUFBLFdBQVcsR0FBRyxJQUFJYiwwQkFBR3NCLGFBQVAsRUFBZDtBQUNBVCxNQUFBQSxXQUFXLENBQUNVLFNBQVosR0FBd0JqQixlQUFPQyxJQUFQO0FBQ3BCQyxrQkFBT0MsTUFBUCxDQUFjWCxhQUFhLENBQUMwQixVQUE1QixDQURvQixDQUF4Qjs7QUFHSDtBQUNELFdBQU9YLFdBQVA7QUFDSDtBQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQnVmZmVyIH0gZnJvbSBcImJ1ZmZlclwiO1xuaW1wb3J0IGJhc2U1OCBmcm9tIFwiLi4vYnM1OFwiO1xuaW1wb3J0IGNjIGZyb20gXCJjcnlwdG8tY29uZGl0aW9uc1wiO1xuXG4vKipcbiAqIExvYWRzIGEgY3J5cHRvLWNvbmRpdGlvbiBjbGFzcyAoRnVsZmlsbG1lbnQgb3IgQ29uZGl0aW9uKSBmcm9tIGEgQmlnY2hhaW5EQiBKU09OIG9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IGNvbmRpdGlvbkpzb25cbiAqIEByZXR1cm5zIHtjYy5Db25kaXRpb259IEVkMjU1MTkgQ29uZGl0aW9uICh0aGF0IHdpbGwgbmVlZCB0byB3cmFwcGVkIGluIGFuIE91dHB1dClcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY2NKc29uTG9hZChjb25kaXRpb25Kc29uKSB7XG4gICAgaWYgKFwiaGFzaFwiIGluIGNvbmRpdGlvbkpzb24pIHtcbiAgICAgICAgY29uc3QgY29uZGl0aW9uID0gbmV3IGNjLkNvbmRpdGlvbigpO1xuICAgICAgICBjb25kaXRpb24udHlwZSA9IGNvbmRpdGlvbkpzb24udHlwZV9pZDtcbiAgICAgICAgY29uZGl0aW9uLmJpdG1hc2sgPSBjb25kaXRpb25Kc29uLmJpdG1hc2s7XG4gICAgICAgIGNvbmRpdGlvbi5oYXNoID0gQnVmZmVyLmZyb20oYmFzZTU4LmRlY29kZShjb25kaXRpb25Kc29uLmhhc2gpKTtcbiAgICAgICAgY29uZGl0aW9uLm1heEZ1bGZpbGxtZW50TGVuZ3RoID0gcGFyc2VJbnQoXG4gICAgICAgICAgICBjb25kaXRpb25Kc29uLm1heF9mdWxmaWxsbWVudF9sZW5ndGgsXG4gICAgICAgICAgICAxMFxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gY29uZGl0aW9uO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBmdWxmaWxsbWVudDtcblxuICAgICAgICBpZiAoY29uZGl0aW9uSnNvbi50eXBlID09PSBcInRocmVzaG9sZC1zaGEtMjU2XCIpIHtcbiAgICAgICAgICAgIGZ1bGZpbGxtZW50ID0gbmV3IGNjLlRocmVzaG9sZFNoYTI1NigpO1xuICAgICAgICAgICAgZnVsZmlsbG1lbnQudGhyZXNob2xkID0gY29uZGl0aW9uSnNvbi50aHJlc2hvbGQ7XG4gICAgICAgICAgICBjb25kaXRpb25Kc29uLnN1YmNvbmRpdGlvbnMuZm9yRWFjaChzdWJjb25kaXRpb25Kc29uID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdWJjb25kaXRpb24gPSBjY0pzb25Mb2FkKHN1YmNvbmRpdGlvbkpzb24pO1xuICAgICAgICAgICAgICAgIGlmIChcImdldENvbmRpdGlvblVyaVwiIGluIHN1YmNvbmRpdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBmdWxmaWxsbWVudC5hZGRTdWJmdWxmaWxsbWVudChzdWJjb25kaXRpb24pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJzZXJpYWxpemVVcmlcIiBpbiBzdWJjb25kaXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgZnVsZmlsbG1lbnQuYWRkU3ViY29uZGl0aW9uKHN1YmNvbmRpdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29uZGl0aW9uSnNvbi50eXBlID09PSBcImVkMjU1MTktc2hhLTI1NlwiKSB7XG4gICAgICAgICAgICBmdWxmaWxsbWVudCA9IG5ldyBjYy5FZDI1NTE5U2hhMjU2KCk7XG4gICAgICAgICAgICBmdWxmaWxsbWVudC5wdWJsaWNLZXkgPSBCdWZmZXIuZnJvbShcbiAgICAgICAgICAgICAgICBiYXNlNTguZGVjb2RlKGNvbmRpdGlvbkpzb24ucHVibGljX2tleSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZ1bGZpbGxtZW50O1xuICAgIH1cbn1cbiJdfQ==