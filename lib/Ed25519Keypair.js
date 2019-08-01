"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = Ed25519Keypair;var _bs = _interopRequireDefault(require("./bs58"));
var _tweetnacl = _interopRequireDefault(require("tweetnacl"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

/**
                                                                                                                                                             * @public
                                                                                                                                                             * Ed25519 keypair in base58 (as BigchainDB expects base58 keys)
                                                                                                                                                             * @type {Object}
                                                                                                                                                             * @param {Buffer} [seed] A seed that will be used as a key derivation function
                                                                                                                                                             * @property {string} publicKey
                                                                                                                                                             * @property {string} privateKey
                                                                                                                                                             */
function Ed25519Keypair(seed) {
  const keyPair = seed ?
  _tweetnacl.default.sign.keyPair.fromSeed(seed) :
  _tweetnacl.default.sign.keyPair();
  this.publicKey = _bs.default.encode(Buffer.from(keyPair.publicKey));
  // tweetnacl's generated secret key is the secret key + public key (resulting in a 64-byte buffer)
  this.privateKey = _bs.default.encode(
  Buffer.from(keyPair.secretKey.slice(0, 32)));

}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9FZDI1NTE5S2V5cGFpci5qcyJdLCJuYW1lcyI6WyJFZDI1NTE5S2V5cGFpciIsInNlZWQiLCJrZXlQYWlyIiwibmFjbCIsInNpZ24iLCJmcm9tU2VlZCIsInB1YmxpY0tleSIsImJhc2U1OCIsImVuY29kZSIsIkJ1ZmZlciIsImZyb20iLCJwcml2YXRlS2V5Iiwic2VjcmV0S2V5Iiwic2xpY2UiXSwibWFwcGluZ3MiOiI0R0FBQTtBQUNBLDhEOztBQUVBOzs7Ozs7OztBQVFlLFNBQVNBLGNBQVQsQ0FBd0JDLElBQXhCLEVBQThCO0FBQ3pDLFFBQU1DLE9BQU8sR0FBR0QsSUFBSTtBQUNkRSxxQkFBS0MsSUFBTCxDQUFVRixPQUFWLENBQWtCRyxRQUFsQixDQUEyQkosSUFBM0IsQ0FEYztBQUVkRSxxQkFBS0MsSUFBTCxDQUFVRixPQUFWLEVBRk47QUFHQSxPQUFLSSxTQUFMLEdBQWlCQyxZQUFPQyxNQUFQLENBQWNDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZUixPQUFPLENBQUNJLFNBQXBCLENBQWQsQ0FBakI7QUFDQTtBQUNBLE9BQUtLLFVBQUwsR0FBa0JKLFlBQU9DLE1BQVA7QUFDZEMsRUFBQUEsTUFBTSxDQUFDQyxJQUFQLENBQVlSLE9BQU8sQ0FBQ1UsU0FBUixDQUFrQkMsS0FBbEIsQ0FBd0IsQ0FBeEIsRUFBMkIsRUFBM0IsQ0FBWixDQURjLENBQWxCOztBQUdIIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJhc2U1OCBmcm9tIFwiLi9iczU4XCI7XG5pbXBvcnQgbmFjbCBmcm9tIFwidHdlZXRuYWNsXCI7XG5cbi8qKlxuICogQHB1YmxpY1xuICogRWQyNTUxOSBrZXlwYWlyIGluIGJhc2U1OCAoYXMgQmlnY2hhaW5EQiBleHBlY3RzIGJhc2U1OCBrZXlzKVxuICogQHR5cGUge09iamVjdH1cbiAqIEBwYXJhbSB7QnVmZmVyfSBbc2VlZF0gQSBzZWVkIHRoYXQgd2lsbCBiZSB1c2VkIGFzIGEga2V5IGRlcml2YXRpb24gZnVuY3Rpb25cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBwdWJsaWNLZXlcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBwcml2YXRlS2V5XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEVkMjU1MTlLZXlwYWlyKHNlZWQpIHtcbiAgICBjb25zdCBrZXlQYWlyID0gc2VlZFxuICAgICAgICA/IG5hY2wuc2lnbi5rZXlQYWlyLmZyb21TZWVkKHNlZWQpXG4gICAgICAgIDogbmFjbC5zaWduLmtleVBhaXIoKTtcbiAgICB0aGlzLnB1YmxpY0tleSA9IGJhc2U1OC5lbmNvZGUoQnVmZmVyLmZyb20oa2V5UGFpci5wdWJsaWNLZXkpKTtcbiAgICAvLyB0d2VldG5hY2wncyBnZW5lcmF0ZWQgc2VjcmV0IGtleSBpcyB0aGUgc2VjcmV0IGtleSArIHB1YmxpYyBrZXkgKHJlc3VsdGluZyBpbiBhIDY0LWJ5dGUgYnVmZmVyKVxuICAgIHRoaXMucHJpdmF0ZUtleSA9IGJhc2U1OC5lbmNvZGUoXG4gICAgICAgIEJ1ZmZlci5mcm9tKGtleVBhaXIuc2VjcmV0S2V5LnNsaWNlKDAsIDMyKSlcbiAgICApO1xufVxuIl19