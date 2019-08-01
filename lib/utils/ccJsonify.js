"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = ccJsonify;var _bs = _interopRequireDefault(require("../bs58"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

/**
                                                                                                                                                                                                                                                           * Serializes a crypto-condition class (Condition or Fulfillment) into a BigchainDB-compatible JSON
                                                                                                                                                                                                                                                           * @param {cc.Fulfillment} fulfillment base58 encoded Ed25519 public key for recipient of the Transaction
                                                                                                                                                                                                                                                           * @returns {Object} Ed25519 Condition (that will need to wrapped in an Output)
                                                                                                                                                                                                                                                           */
function ccJsonify(fulfillment) {
  let conditionUri;

  if ("getConditionUri" in fulfillment) {
    conditionUri = fulfillment.getConditionUri();
  } else if ("serializeUri" in fulfillment) {
    conditionUri = fulfillment.serializeUri();
  }

  const jsonBody = {
    details: {},
    uri: conditionUri };


  if (fulfillment.getTypeId() === 0) {
    jsonBody.details.type_id = 0;
    jsonBody.details.bitmask = 3;

    if ("preimage" in fulfillment) {
      jsonBody.details.preimage = fulfillment.preimage.toString();
      jsonBody.details.type = "fulfillment";
    }
  }

  if (fulfillment.getTypeId() === 2) {
    return {
      details: {
        type: "threshold-sha-256",
        threshold: fulfillment.threshold,
        subconditions: fulfillment.subconditions.map(subcondition => {
          const subconditionJson = ccJsonify(subcondition.body);
          return subconditionJson.details;
        }) },

      uri: conditionUri };

  }

  if (fulfillment.getTypeId() === 4) {
    jsonBody.details.type = "ed25519-sha-256";

    if ("publicKey" in fulfillment) {
      jsonBody.details.public_key = _bs.default.encode(fulfillment.publicKey);
    }
  }

  if ("hash" in fulfillment) {
    jsonBody.details.hash = _bs.default.encode(fulfillment.hash);
    jsonBody.details.max_fulfillment_length =
    fulfillment.maxFulfillmentLength;
    jsonBody.details.type = "condition";
  }

  return jsonBody;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9jY0pzb25pZnkuanMiXSwibmFtZXMiOlsiY2NKc29uaWZ5IiwiZnVsZmlsbG1lbnQiLCJjb25kaXRpb25VcmkiLCJnZXRDb25kaXRpb25VcmkiLCJzZXJpYWxpemVVcmkiLCJqc29uQm9keSIsImRldGFpbHMiLCJ1cmkiLCJnZXRUeXBlSWQiLCJ0eXBlX2lkIiwiYml0bWFzayIsInByZWltYWdlIiwidG9TdHJpbmciLCJ0eXBlIiwidGhyZXNob2xkIiwic3ViY29uZGl0aW9ucyIsIm1hcCIsInN1YmNvbmRpdGlvbiIsInN1YmNvbmRpdGlvbkpzb24iLCJib2R5IiwicHVibGljX2tleSIsImJhc2U1OCIsImVuY29kZSIsInB1YmxpY0tleSIsImhhc2giLCJtYXhfZnVsZmlsbG1lbnRfbGVuZ3RoIiwibWF4RnVsZmlsbG1lbnRMZW5ndGgiXSwibWFwcGluZ3MiOiJ1R0FBQSxxRDs7QUFFQTs7Ozs7QUFLZSxTQUFTQSxTQUFULENBQW1CQyxXQUFuQixFQUFnQztBQUMzQyxNQUFJQyxZQUFKOztBQUVBLE1BQUkscUJBQXFCRCxXQUF6QixFQUFzQztBQUNsQ0MsSUFBQUEsWUFBWSxHQUFHRCxXQUFXLENBQUNFLGVBQVosRUFBZjtBQUNILEdBRkQsTUFFTyxJQUFJLGtCQUFrQkYsV0FBdEIsRUFBbUM7QUFDdENDLElBQUFBLFlBQVksR0FBR0QsV0FBVyxDQUFDRyxZQUFaLEVBQWY7QUFDSDs7QUFFRCxRQUFNQyxRQUFRLEdBQUc7QUFDYkMsSUFBQUEsT0FBTyxFQUFFLEVBREk7QUFFYkMsSUFBQUEsR0FBRyxFQUFFTCxZQUZRLEVBQWpCOzs7QUFLQSxNQUFJRCxXQUFXLENBQUNPLFNBQVosT0FBNEIsQ0FBaEMsRUFBbUM7QUFDL0JILElBQUFBLFFBQVEsQ0FBQ0MsT0FBVCxDQUFpQkcsT0FBakIsR0FBMkIsQ0FBM0I7QUFDQUosSUFBQUEsUUFBUSxDQUFDQyxPQUFULENBQWlCSSxPQUFqQixHQUEyQixDQUEzQjs7QUFFQSxRQUFJLGNBQWNULFdBQWxCLEVBQStCO0FBQzNCSSxNQUFBQSxRQUFRLENBQUNDLE9BQVQsQ0FBaUJLLFFBQWpCLEdBQTRCVixXQUFXLENBQUNVLFFBQVosQ0FBcUJDLFFBQXJCLEVBQTVCO0FBQ0FQLE1BQUFBLFFBQVEsQ0FBQ0MsT0FBVCxDQUFpQk8sSUFBakIsR0FBd0IsYUFBeEI7QUFDSDtBQUNKOztBQUVELE1BQUlaLFdBQVcsQ0FBQ08sU0FBWixPQUE0QixDQUFoQyxFQUFtQztBQUMvQixXQUFPO0FBQ0hGLE1BQUFBLE9BQU8sRUFBRTtBQUNMTyxRQUFBQSxJQUFJLEVBQUUsbUJBREQ7QUFFTEMsUUFBQUEsU0FBUyxFQUFFYixXQUFXLENBQUNhLFNBRmxCO0FBR0xDLFFBQUFBLGFBQWEsRUFBRWQsV0FBVyxDQUFDYyxhQUFaLENBQTBCQyxHQUExQixDQUE4QkMsWUFBWSxJQUFJO0FBQ3pELGdCQUFNQyxnQkFBZ0IsR0FBR2xCLFNBQVMsQ0FBQ2lCLFlBQVksQ0FBQ0UsSUFBZCxDQUFsQztBQUNBLGlCQUFPRCxnQkFBZ0IsQ0FBQ1osT0FBeEI7QUFDSCxTQUhjLENBSFYsRUFETjs7QUFTSEMsTUFBQUEsR0FBRyxFQUFFTCxZQVRGLEVBQVA7O0FBV0g7O0FBRUQsTUFBSUQsV0FBVyxDQUFDTyxTQUFaLE9BQTRCLENBQWhDLEVBQW1DO0FBQy9CSCxJQUFBQSxRQUFRLENBQUNDLE9BQVQsQ0FBaUJPLElBQWpCLEdBQXdCLGlCQUF4Qjs7QUFFQSxRQUFJLGVBQWVaLFdBQW5CLEVBQWdDO0FBQzVCSSxNQUFBQSxRQUFRLENBQUNDLE9BQVQsQ0FBaUJjLFVBQWpCLEdBQThCQyxZQUFPQyxNQUFQLENBQWNyQixXQUFXLENBQUNzQixTQUExQixDQUE5QjtBQUNIO0FBQ0o7O0FBRUQsTUFBSSxVQUFVdEIsV0FBZCxFQUEyQjtBQUN2QkksSUFBQUEsUUFBUSxDQUFDQyxPQUFULENBQWlCa0IsSUFBakIsR0FBd0JILFlBQU9DLE1BQVAsQ0FBY3JCLFdBQVcsQ0FBQ3VCLElBQTFCLENBQXhCO0FBQ0FuQixJQUFBQSxRQUFRLENBQUNDLE9BQVQsQ0FBaUJtQixzQkFBakI7QUFDSXhCLElBQUFBLFdBQVcsQ0FBQ3lCLG9CQURoQjtBQUVBckIsSUFBQUEsUUFBUSxDQUFDQyxPQUFULENBQWlCTyxJQUFqQixHQUF3QixXQUF4QjtBQUNIOztBQUVELFNBQU9SLFFBQVA7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiYXNlNTggZnJvbSBcIi4uL2JzNThcIjtcblxuLyoqXG4gKiBTZXJpYWxpemVzIGEgY3J5cHRvLWNvbmRpdGlvbiBjbGFzcyAoQ29uZGl0aW9uIG9yIEZ1bGZpbGxtZW50KSBpbnRvIGEgQmlnY2hhaW5EQi1jb21wYXRpYmxlIEpTT05cbiAqIEBwYXJhbSB7Y2MuRnVsZmlsbG1lbnR9IGZ1bGZpbGxtZW50IGJhc2U1OCBlbmNvZGVkIEVkMjU1MTkgcHVibGljIGtleSBmb3IgcmVjaXBpZW50IG9mIHRoZSBUcmFuc2FjdGlvblxuICogQHJldHVybnMge09iamVjdH0gRWQyNTUxOSBDb25kaXRpb24gKHRoYXQgd2lsbCBuZWVkIHRvIHdyYXBwZWQgaW4gYW4gT3V0cHV0KVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjY0pzb25pZnkoZnVsZmlsbG1lbnQpIHtcbiAgICBsZXQgY29uZGl0aW9uVXJpO1xuXG4gICAgaWYgKFwiZ2V0Q29uZGl0aW9uVXJpXCIgaW4gZnVsZmlsbG1lbnQpIHtcbiAgICAgICAgY29uZGl0aW9uVXJpID0gZnVsZmlsbG1lbnQuZ2V0Q29uZGl0aW9uVXJpKCk7XG4gICAgfSBlbHNlIGlmIChcInNlcmlhbGl6ZVVyaVwiIGluIGZ1bGZpbGxtZW50KSB7XG4gICAgICAgIGNvbmRpdGlvblVyaSA9IGZ1bGZpbGxtZW50LnNlcmlhbGl6ZVVyaSgpO1xuICAgIH1cblxuICAgIGNvbnN0IGpzb25Cb2R5ID0ge1xuICAgICAgICBkZXRhaWxzOiB7fSxcbiAgICAgICAgdXJpOiBjb25kaXRpb25VcmlcbiAgICB9O1xuXG4gICAgaWYgKGZ1bGZpbGxtZW50LmdldFR5cGVJZCgpID09PSAwKSB7XG4gICAgICAgIGpzb25Cb2R5LmRldGFpbHMudHlwZV9pZCA9IDA7XG4gICAgICAgIGpzb25Cb2R5LmRldGFpbHMuYml0bWFzayA9IDM7XG5cbiAgICAgICAgaWYgKFwicHJlaW1hZ2VcIiBpbiBmdWxmaWxsbWVudCkge1xuICAgICAgICAgICAganNvbkJvZHkuZGV0YWlscy5wcmVpbWFnZSA9IGZ1bGZpbGxtZW50LnByZWltYWdlLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBqc29uQm9keS5kZXRhaWxzLnR5cGUgPSBcImZ1bGZpbGxtZW50XCI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZnVsZmlsbG1lbnQuZ2V0VHlwZUlkKCkgPT09IDIpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRldGFpbHM6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcInRocmVzaG9sZC1zaGEtMjU2XCIsXG4gICAgICAgICAgICAgICAgdGhyZXNob2xkOiBmdWxmaWxsbWVudC50aHJlc2hvbGQsXG4gICAgICAgICAgICAgICAgc3ViY29uZGl0aW9uczogZnVsZmlsbG1lbnQuc3ViY29uZGl0aW9ucy5tYXAoc3ViY29uZGl0aW9uID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3ViY29uZGl0aW9uSnNvbiA9IGNjSnNvbmlmeShzdWJjb25kaXRpb24uYm9keSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdWJjb25kaXRpb25Kc29uLmRldGFpbHM7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB1cmk6IGNvbmRpdGlvblVyaVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGlmIChmdWxmaWxsbWVudC5nZXRUeXBlSWQoKSA9PT0gNCkge1xuICAgICAgICBqc29uQm9keS5kZXRhaWxzLnR5cGUgPSBcImVkMjU1MTktc2hhLTI1NlwiO1xuXG4gICAgICAgIGlmIChcInB1YmxpY0tleVwiIGluIGZ1bGZpbGxtZW50KSB7XG4gICAgICAgICAgICBqc29uQm9keS5kZXRhaWxzLnB1YmxpY19rZXkgPSBiYXNlNTguZW5jb2RlKGZ1bGZpbGxtZW50LnB1YmxpY0tleSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoXCJoYXNoXCIgaW4gZnVsZmlsbG1lbnQpIHtcbiAgICAgICAganNvbkJvZHkuZGV0YWlscy5oYXNoID0gYmFzZTU4LmVuY29kZShmdWxmaWxsbWVudC5oYXNoKTtcbiAgICAgICAganNvbkJvZHkuZGV0YWlscy5tYXhfZnVsZmlsbG1lbnRfbGVuZ3RoID1cbiAgICAgICAgICAgIGZ1bGZpbGxtZW50Lm1heEZ1bGZpbGxtZW50TGVuZ3RoO1xuICAgICAgICBqc29uQm9keS5kZXRhaWxzLnR5cGUgPSBcImNvbmRpdGlvblwiO1xuICAgIH1cblxuICAgIHJldHVybiBqc29uQm9keTtcbn1cbiJdfQ==