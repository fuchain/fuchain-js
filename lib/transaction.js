"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _buffer = require("buffer");
var _jsonStableStringify = _interopRequireDefault(require("json-stable-stringify"));
var _clone = _interopRequireDefault(require("clone"));
var _bs = _interopRequireDefault(require("./bs58"));
var _cryptoConditions = _interopRequireDefault(require("crypto-conditions"));
var _ccJsonify = _interopRequireDefault(require("./utils/ccJsonify"));
var _sha256Hash = _interopRequireDefault(require("./sha256Hash"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

/**
                                                                                                                                                                 * Construct Transactions
                                                                                                                                                                 */
class Transaction {
  /**
                    * Canonically serializes a transaction into a string by sorting the keys
                    * @param {Object} (transaction)
                    * @return {string} a canonically serialized Transaction
                    */
  static serializeTransactionIntoCanonicalString(transaction) {
    // BigchainDB signs fulfillments by serializing transactions into a
    // "canonical" format where
    const tx = (0, _clone.default)(transaction);
    // TODO: set fulfillments to null
    // Sort the keys
    return (0, _jsonStableStringify.default)(tx, (a, b) => a.key > b.key ? 1 : -1);
  }

  static makeInputTemplate(
  publicKeys = [],
  fulfills = null,
  fulfillment = null)
  {
    return {
      fulfillment,
      fulfills,
      owners_before: publicKeys };

  }

  static makeTransactionTemplate() {
    const txTemplate = {
      id: null,
      operation: null,
      outputs: [],
      inputs: [],
      metadata: null,
      asset: null,
      version: "2.0" };

    return txTemplate;
  }

  static makeTransaction(
  operation,
  asset,
  metadata = null,
  outputs = [],
  inputs = [])
  {
    const tx = Transaction.makeTransactionTemplate();
    tx.operation = operation;
    tx.asset = asset;
    tx.metadata = metadata;
    tx.inputs = inputs;
    tx.outputs = outputs;
    return tx;
  }

  /**
     * Generate a `CREATE` transaction holding the `asset`, `metadata`, and `outputs`, to be signed by
     * the `issuers`.
     * @param {Object} asset Created asset's data
     * @param {Object} metadata Metadata for the Transaction
     * @param {Object[]} outputs Array of Output objects to add to the Transaction.
     *                           Think of these as the recipients of the asset after the transaction.
     *                           For `CREATE` Transactions, this should usually just be a list of
     *                           Outputs wrapping Ed25519 Conditions generated from the issuers' public
     *                           keys (so that the issuers are the recipients of the created asset).
     * @param {...string[]} issuers Public key of one or more issuers to the asset being created by this
     *                              Transaction.
     *                              Note: Each of the private keys corresponding to the given public
     *                              keys MUST be used later (and in the same order) when signing the
     *                              Transaction (`signTransaction()`).
     * @returns {Object} Unsigned transaction -- make sure to call signTransaction() on it before
     *                   sending it off!
     */
  static makeCreateTransaction(asset, metadata, outputs, ...issuers) {
    const assetDefinition = {
      data: asset || null };

    const inputs = issuers.map((issuer) =>
    Transaction.makeInputTemplate([issuer]));


    return Transaction.makeTransaction(
    "CREATE",
    assetDefinition,
    metadata,
    outputs,
    inputs);

  }

  /**
     * Create an Ed25519 Cryptocondition from an Ed25519 public key
     * to put into an Output of a Transaction
     * @param {string} publicKey base58 encoded Ed25519 public key for the recipient of the Transaction
     * @param {boolean} [json=true] If true returns a json object otherwise a crypto-condition type
     * @returns {Object} Ed25519 Condition (that will need to wrapped in an Output)
     */
  static makeEd25519Condition(publicKey, json = true) {
    const publicKeyBuffer = _buffer.Buffer.from(_bs.default.decode(publicKey));

    const ed25519Fulfillment = new _cryptoConditions.default.Ed25519Sha256();
    ed25519Fulfillment.setPublicKey(publicKeyBuffer);

    if (json) {
      return (0, _ccJsonify.default)(ed25519Fulfillment);
    }

    return ed25519Fulfillment;
  }

  /**
     * Create an Output from a Condition.
     * Note: Assumes the given Condition was generated from a
     * single public key (e.g. a Ed25519 Condition)
     * @param {Object} condition Condition (e.g. a Ed25519 Condition from `makeEd25519Condition()`)
     * @param {string} amount Amount of the output
     * @returns {Object} An Output usable in a Transaction
     */
  static makeOutput(condition, amount = "1") {
    if (typeof amount !== "string") {
      throw new TypeError("`amount` must be of type string");
    }
    const publicKeys = [];
    const getPublicKeys = details => {
      if (details.type === "ed25519-sha-256") {
        if (!publicKeys.includes(details.public_key)) {
          publicKeys.push(details.public_key);
        }
      } else if (details.type === "threshold-sha-256") {
        details.subconditions.map(getPublicKeys);
      }
    };
    getPublicKeys(condition.details);
    return {
      condition,
      amount: amount,
      public_keys: publicKeys };

  }

  /**
     * Create a Preimage-Sha256 Cryptocondition from a secret to put into an Output of a Transaction
     * @param {string} preimage Preimage to be hashed and wrapped in a crypto-condition
     * @param {boolean} [json=true] If true returns a json object otherwise a crypto-condition type
     * @returns {Object} Preimage-Sha256 Condition (that will need to wrapped in an Output)
     */
  static makeSha256Condition(preimage, json = true) {
    const sha256Fulfillment = new _cryptoConditions.default.PreimageSha256();
    sha256Fulfillment.preimage = _buffer.Buffer.from(preimage);

    if (json) {
      return (0, _ccJsonify.default)(sha256Fulfillment);
    }
    return sha256Fulfillment;
  }

  /**
     * Create an Sha256 Threshold Cryptocondition from threshold to put into an Output of a Transaction
     * @param {number} threshold
     * @param {Array} [subconditions=[]]
     * @param {boolean} [json=true] If true returns a json object otherwise a crypto-condition type
     * @returns {Object} Sha256 Threshold Condition (that will need to wrapped in an Output)
     */
  static makeThresholdCondition(threshold, subconditions = [], json = true) {
    const thresholdCondition = new _cryptoConditions.default.ThresholdSha256();
    thresholdCondition.threshold = threshold;

    subconditions.forEach(subcondition => {
      // TODO: add support for Condition and URIs
      thresholdCondition.addSubfulfillment(subcondition);
    });

    if (json) {
      return (0, _ccJsonify.default)(thresholdCondition);
    }

    return thresholdCondition;
  }

  /**
     * Generate a `TRANSFER` transaction holding the `asset`, `metadata`, and `outputs`, that fulfills
     * the `fulfilledOutputs` of `unspentTransaction`.
     * @param {Object} unspentTransaction Previous Transaction you have control over (i.e. can fulfill
     *                                    its Output Condition)
     * @param {Object} metadata Metadata for the Transaction
     * @param {Object[]} outputs Array of Output objects to add to the Transaction.
     *                           Think of these as the recipients of the asset after the transaction.
     *                           For `TRANSFER` Transactions, this should usually just be a list of
     *                           Outputs wrapping Ed25519 Conditions generated from the public keys of
     *                           the recipients.
     * @param {...number} OutputIndices Indices of the Outputs in `unspentTransaction` that this
     *                                     Transaction fulfills.
     *                                     Note that listed public keys listed must be used (and in
     *                                     the same order) to sign the Transaction
     *                                     (`signTransaction()`).
     * @returns {Object} Unsigned transaction -- make sure to call signTransaction() on it before
     *                   sending it off!
     */
  // TODO:
  // - Make `metadata` optional argument
  static makeTransferTransaction(unspentOutputs, outputs, metadata) {
    const inputs = unspentOutputs.map(unspentOutput => {
      const { tx, outputIndex } = {
        tx: unspentOutput.tx,
        outputIndex: unspentOutput.output_index };

      const fulfilledOutput = tx.outputs[outputIndex];
      const transactionLink = {
        output_index: outputIndex,
        transaction_id: tx.id };


      return Transaction.makeInputTemplate(
      fulfilledOutput.public_keys,
      transactionLink);

    });

    const assetLink = {
      id:
      unspentOutputs[0].tx.operation === "CREATE" ?
      unspentOutputs[0].tx.id :
      unspentOutputs[0].tx.asset.id };

    return Transaction.makeTransaction(
    "TRANSFER",
    assetLink,
    metadata,
    outputs,
    inputs);

  }

  /**
     * Sign the given `transaction` with the given `privateKey`s, returning a new copy of `transaction`
     * that's been signed.
     * Note: Only generates Ed25519 Fulfillments. Thresholds and other types of Fulfillments are left as
     * an exercise for the user.
     * @param {Object} transaction Transaction to sign. `transaction` is not modified.
     * @param {...string} privateKeys Private keys associated with the issuers of the `transaction`.
     *                                Looped through to iteratively sign any Input Fulfillments found in
     *                                the `transaction`.
     * @returns {Object} The signed version of `transaction`.
     */
  static signTransaction(transaction, ...privateKeys) {
    const signedTx = (0, _clone.default)(transaction);
    const serializedTransaction = Transaction.serializeTransactionIntoCanonicalString(
    transaction);


    signedTx.inputs.forEach((input, index) => {
      const privateKey = privateKeys[index];
      const privateKeyBuffer = _buffer.Buffer.from(_bs.default.decode(privateKey));

      const transactionUniqueFulfillment = input.fulfills ?
      serializedTransaction.
      concat(input.fulfills.transaction_id).
      concat(input.fulfills.output_index) :
      serializedTransaction;
      const transactionHash = (0, _sha256Hash.default)(transactionUniqueFulfillment);
      const ed25519Fulfillment = new _cryptoConditions.default.Ed25519Sha256();
      ed25519Fulfillment.sign(
      _buffer.Buffer.from(transactionHash, "hex"),
      privateKeyBuffer);

      const fulfillmentUri = ed25519Fulfillment.serializeUri();

      input.fulfillment = fulfillmentUri;
    });

    const serializedSignedTransaction = Transaction.serializeTransactionIntoCanonicalString(
    signedTx);

    signedTx.id = (0, _sha256Hash.default)(serializedSignedTransaction);
    return signedTx;
  }}exports.default = Transaction;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy90cmFuc2FjdGlvbi5qcyJdLCJuYW1lcyI6WyJUcmFuc2FjdGlvbiIsInNlcmlhbGl6ZVRyYW5zYWN0aW9uSW50b0Nhbm9uaWNhbFN0cmluZyIsInRyYW5zYWN0aW9uIiwidHgiLCJhIiwiYiIsImtleSIsIm1ha2VJbnB1dFRlbXBsYXRlIiwicHVibGljS2V5cyIsImZ1bGZpbGxzIiwiZnVsZmlsbG1lbnQiLCJvd25lcnNfYmVmb3JlIiwibWFrZVRyYW5zYWN0aW9uVGVtcGxhdGUiLCJ0eFRlbXBsYXRlIiwiaWQiLCJvcGVyYXRpb24iLCJvdXRwdXRzIiwiaW5wdXRzIiwibWV0YWRhdGEiLCJhc3NldCIsInZlcnNpb24iLCJtYWtlVHJhbnNhY3Rpb24iLCJtYWtlQ3JlYXRlVHJhbnNhY3Rpb24iLCJpc3N1ZXJzIiwiYXNzZXREZWZpbml0aW9uIiwiZGF0YSIsIm1hcCIsImlzc3VlciIsIm1ha2VFZDI1NTE5Q29uZGl0aW9uIiwicHVibGljS2V5IiwianNvbiIsInB1YmxpY0tleUJ1ZmZlciIsIkJ1ZmZlciIsImZyb20iLCJiYXNlNTgiLCJkZWNvZGUiLCJlZDI1NTE5RnVsZmlsbG1lbnQiLCJjYyIsIkVkMjU1MTlTaGEyNTYiLCJzZXRQdWJsaWNLZXkiLCJtYWtlT3V0cHV0IiwiY29uZGl0aW9uIiwiYW1vdW50IiwiVHlwZUVycm9yIiwiZ2V0UHVibGljS2V5cyIsImRldGFpbHMiLCJ0eXBlIiwiaW5jbHVkZXMiLCJwdWJsaWNfa2V5IiwicHVzaCIsInN1YmNvbmRpdGlvbnMiLCJwdWJsaWNfa2V5cyIsIm1ha2VTaGEyNTZDb25kaXRpb24iLCJwcmVpbWFnZSIsInNoYTI1NkZ1bGZpbGxtZW50IiwiUHJlaW1hZ2VTaGEyNTYiLCJtYWtlVGhyZXNob2xkQ29uZGl0aW9uIiwidGhyZXNob2xkIiwidGhyZXNob2xkQ29uZGl0aW9uIiwiVGhyZXNob2xkU2hhMjU2IiwiZm9yRWFjaCIsInN1YmNvbmRpdGlvbiIsImFkZFN1YmZ1bGZpbGxtZW50IiwibWFrZVRyYW5zZmVyVHJhbnNhY3Rpb24iLCJ1bnNwZW50T3V0cHV0cyIsInVuc3BlbnRPdXRwdXQiLCJvdXRwdXRJbmRleCIsIm91dHB1dF9pbmRleCIsImZ1bGZpbGxlZE91dHB1dCIsInRyYW5zYWN0aW9uTGluayIsInRyYW5zYWN0aW9uX2lkIiwiYXNzZXRMaW5rIiwic2lnblRyYW5zYWN0aW9uIiwicHJpdmF0ZUtleXMiLCJzaWduZWRUeCIsInNlcmlhbGl6ZWRUcmFuc2FjdGlvbiIsImlucHV0IiwiaW5kZXgiLCJwcml2YXRlS2V5IiwicHJpdmF0ZUtleUJ1ZmZlciIsInRyYW5zYWN0aW9uVW5pcXVlRnVsZmlsbG1lbnQiLCJjb25jYXQiLCJ0cmFuc2FjdGlvbkhhc2giLCJzaWduIiwiZnVsZmlsbG1lbnRVcmkiLCJzZXJpYWxpemVVcmkiLCJzZXJpYWxpemVkU2lnbmVkVHJhbnNhY3Rpb24iXSwibWFwcGluZ3MiOiJvR0FBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrRTs7QUFFQTs7O0FBR2UsTUFBTUEsV0FBTixDQUFrQjtBQUM3Qjs7Ozs7QUFLQSxTQUFPQyx1Q0FBUCxDQUErQ0MsV0FBL0MsRUFBNEQ7QUFDeEQ7QUFDQTtBQUNBLFVBQU1DLEVBQUUsR0FBRyxvQkFBTUQsV0FBTixDQUFYO0FBQ0E7QUFDQTtBQUNBLFdBQU8sa0NBQWdCQyxFQUFoQixFQUFvQixDQUFDQyxDQUFELEVBQUlDLENBQUosS0FBV0QsQ0FBQyxDQUFDRSxHQUFGLEdBQVFELENBQUMsQ0FBQ0MsR0FBVixHQUFnQixDQUFoQixHQUFvQixDQUFDLENBQXBELENBQVA7QUFDSDs7QUFFRCxTQUFPQyxpQkFBUDtBQUNJQyxFQUFBQSxVQUFVLEdBQUcsRUFEakI7QUFFSUMsRUFBQUEsUUFBUSxHQUFHLElBRmY7QUFHSUMsRUFBQUEsV0FBVyxHQUFHLElBSGxCO0FBSUU7QUFDRSxXQUFPO0FBQ0hBLE1BQUFBLFdBREc7QUFFSEQsTUFBQUEsUUFGRztBQUdIRSxNQUFBQSxhQUFhLEVBQUVILFVBSFosRUFBUDs7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MkIsR0FBR3RGLFdBQVcsQ0FBQ0MsdUNBQVo7QUFDaEN5RSxJQUFBQSxRQURnQyxDQUFwQzs7QUFHQUEsSUFBQUEsUUFBUSxDQUFDNUQsRUFBVCxHQUFjLHlCQUFXd0UsMkJBQVgsQ0FBZDtBQUNBLFdBQU9aLFFBQVA7QUFDSCxHQXBSNEIsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJ1ZmZlciB9IGZyb20gXCJidWZmZXJcIjtcbmltcG9ydCBzdGFibGVTdHJpbmdpZnkgZnJvbSBcImpzb24tc3RhYmxlLXN0cmluZ2lmeVwiO1xuaW1wb3J0IGNsb25lIGZyb20gXCJjbG9uZVwiO1xuaW1wb3J0IGJhc2U1OCBmcm9tIFwiLi9iczU4XCI7XG5pbXBvcnQgY2MgZnJvbSBcImNyeXB0by1jb25kaXRpb25zXCI7XG5pbXBvcnQgY2NKc29uaWZ5IGZyb20gXCIuL3V0aWxzL2NjSnNvbmlmeVwiO1xuaW1wb3J0IHNoYTI1Nkhhc2ggZnJvbSBcIi4vc2hhMjU2SGFzaFwiO1xuXG4vKipcbiAqIENvbnN0cnVjdCBUcmFuc2FjdGlvbnNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhbnNhY3Rpb24ge1xuICAgIC8qKlxuICAgICAqIENhbm9uaWNhbGx5IHNlcmlhbGl6ZXMgYSB0cmFuc2FjdGlvbiBpbnRvIGEgc3RyaW5nIGJ5IHNvcnRpbmcgdGhlIGtleXNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gKHRyYW5zYWN0aW9uKVxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gYSBjYW5vbmljYWxseSBzZXJpYWxpemVkIFRyYW5zYWN0aW9uXG4gICAgICovXG4gICAgc3RhdGljIHNlcmlhbGl6ZVRyYW5zYWN0aW9uSW50b0Nhbm9uaWNhbFN0cmluZyh0cmFuc2FjdGlvbikge1xuICAgICAgICAvLyBCaWdjaGFpbkRCIHNpZ25zIGZ1bGZpbGxtZW50cyBieSBzZXJpYWxpemluZyB0cmFuc2FjdGlvbnMgaW50byBhXG4gICAgICAgIC8vIFwiY2Fub25pY2FsXCIgZm9ybWF0IHdoZXJlXG4gICAgICAgIGNvbnN0IHR4ID0gY2xvbmUodHJhbnNhY3Rpb24pO1xuICAgICAgICAvLyBUT0RPOiBzZXQgZnVsZmlsbG1lbnRzIHRvIG51bGxcbiAgICAgICAgLy8gU29ydCB0aGUga2V5c1xuICAgICAgICByZXR1cm4gc3RhYmxlU3RyaW5naWZ5KHR4LCAoYSwgYikgPT4gKGEua2V5ID4gYi5rZXkgPyAxIDogLTEpKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgbWFrZUlucHV0VGVtcGxhdGUoXG4gICAgICAgIHB1YmxpY0tleXMgPSBbXSxcbiAgICAgICAgZnVsZmlsbHMgPSBudWxsLFxuICAgICAgICBmdWxmaWxsbWVudCA9IG51bGxcbiAgICApIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGZ1bGZpbGxtZW50LFxuICAgICAgICAgICAgZnVsZmlsbHMsXG4gICAgICAgICAgICBvd25lcnNfYmVmb3JlOiBwdWJsaWNLZXlzXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgc3RhdGljIG1ha2VUcmFuc2FjdGlvblRlbXBsYXRlKCkge1xuICAgICAgICBjb25zdCB0eFRlbXBsYXRlID0ge1xuICAgICAgICAgICAgaWQ6IG51bGwsXG4gICAgICAgICAgICBvcGVyYXRpb246IG51bGwsXG4gICAgICAgICAgICBvdXRwdXRzOiBbXSxcbiAgICAgICAgICAgIGlucHV0czogW10sXG4gICAgICAgICAgICBtZXRhZGF0YTogbnVsbCxcbiAgICAgICAgICAgIGFzc2V0OiBudWxsLFxuICAgICAgICAgICAgdmVyc2lvbjogXCIyLjBcIlxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gdHhUZW1wbGF0ZTtcbiAgICB9XG5cbiAgICBzdGF0aWMgbWFrZVRyYW5zYWN0aW9uKFxuICAgICAgICBvcGVyYXRpb24sXG4gICAgICAgIGFzc2V0LFxuICAgICAgICBtZXRhZGF0YSA9IG51bGwsXG4gICAgICAgIG91dHB1dHMgPSBbXSxcbiAgICAgICAgaW5wdXRzID0gW11cbiAgICApIHtcbiAgICAgICAgY29uc3QgdHggPSBUcmFuc2FjdGlvbi5tYWtlVHJhbnNhY3Rpb25UZW1wbGF0ZSgpO1xuICAgICAgICB0eC5vcGVyYXRpb24gPSBvcGVyYXRpb247XG4gICAgICAgIHR4LmFzc2V0ID0gYXNzZXQ7XG4gICAgICAgIHR4Lm1ldGFkYXRhID0gbWV0YWRhdGE7XG4gICAgICAgIHR4LmlucHV0cyA9IGlucHV0cztcbiAgICAgICAgdHgub3V0cHV0cyA9IG91dHB1dHM7XG4gICAgICAgIHJldHVybiB0eDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZW5lcmF0ZSBhIGBDUkVBVEVgIHRyYW5zYWN0aW9uIGhvbGRpbmcgdGhlIGBhc3NldGAsIGBtZXRhZGF0YWAsIGFuZCBgb3V0cHV0c2AsIHRvIGJlIHNpZ25lZCBieVxuICAgICAqIHRoZSBgaXNzdWVyc2AuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGFzc2V0IENyZWF0ZWQgYXNzZXQncyBkYXRhXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG1ldGFkYXRhIE1ldGFkYXRhIGZvciB0aGUgVHJhbnNhY3Rpb25cbiAgICAgKiBAcGFyYW0ge09iamVjdFtdfSBvdXRwdXRzIEFycmF5IG9mIE91dHB1dCBvYmplY3RzIHRvIGFkZCB0byB0aGUgVHJhbnNhY3Rpb24uXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICBUaGluayBvZiB0aGVzZSBhcyB0aGUgcmVjaXBpZW50cyBvZiB0aGUgYXNzZXQgYWZ0ZXIgdGhlIHRyYW5zYWN0aW9uLlxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgRm9yIGBDUkVBVEVgIFRyYW5zYWN0aW9ucywgdGhpcyBzaG91bGQgdXN1YWxseSBqdXN0IGJlIGEgbGlzdCBvZlxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgT3V0cHV0cyB3cmFwcGluZyBFZDI1NTE5IENvbmRpdGlvbnMgZ2VuZXJhdGVkIGZyb20gdGhlIGlzc3VlcnMnIHB1YmxpY1xuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5cyAoc28gdGhhdCB0aGUgaXNzdWVycyBhcmUgdGhlIHJlY2lwaWVudHMgb2YgdGhlIGNyZWF0ZWQgYXNzZXQpLlxuICAgICAqIEBwYXJhbSB7Li4uc3RyaW5nW119IGlzc3VlcnMgUHVibGljIGtleSBvZiBvbmUgb3IgbW9yZSBpc3N1ZXJzIHRvIHRoZSBhc3NldCBiZWluZyBjcmVhdGVkIGJ5IHRoaXNcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRyYW5zYWN0aW9uLlxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTm90ZTogRWFjaCBvZiB0aGUgcHJpdmF0ZSBrZXlzIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGdpdmVuIHB1YmxpY1xuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5cyBNVVNUIGJlIHVzZWQgbGF0ZXIgKGFuZCBpbiB0aGUgc2FtZSBvcmRlcikgd2hlbiBzaWduaW5nIHRoZVxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVHJhbnNhY3Rpb24gKGBzaWduVHJhbnNhY3Rpb24oKWApLlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFVuc2lnbmVkIHRyYW5zYWN0aW9uIC0tIG1ha2Ugc3VyZSB0byBjYWxsIHNpZ25UcmFuc2FjdGlvbigpIG9uIGl0IGJlZm9yZVxuICAgICAqICAgICAgICAgICAgICAgICAgIHNlbmRpbmcgaXQgb2ZmIVxuICAgICAqL1xuICAgIHN0YXRpYyBtYWtlQ3JlYXRlVHJhbnNhY3Rpb24oYXNzZXQsIG1ldGFkYXRhLCBvdXRwdXRzLCAuLi5pc3N1ZXJzKSB7XG4gICAgICAgIGNvbnN0IGFzc2V0RGVmaW5pdGlvbiA9IHtcbiAgICAgICAgICAgIGRhdGE6IGFzc2V0IHx8IG51bGxcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgaW5wdXRzID0gaXNzdWVycy5tYXAoaXNzdWVyID0+XG4gICAgICAgICAgICBUcmFuc2FjdGlvbi5tYWtlSW5wdXRUZW1wbGF0ZShbaXNzdWVyXSlcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4gVHJhbnNhY3Rpb24ubWFrZVRyYW5zYWN0aW9uKFxuICAgICAgICAgICAgXCJDUkVBVEVcIixcbiAgICAgICAgICAgIGFzc2V0RGVmaW5pdGlvbixcbiAgICAgICAgICAgIG1ldGFkYXRhLFxuICAgICAgICAgICAgb3V0cHV0cyxcbiAgICAgICAgICAgIGlucHV0c1xuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhbiBFZDI1NTE5IENyeXB0b2NvbmRpdGlvbiBmcm9tIGFuIEVkMjU1MTkgcHVibGljIGtleVxuICAgICAqIHRvIHB1dCBpbnRvIGFuIE91dHB1dCBvZiBhIFRyYW5zYWN0aW9uXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHB1YmxpY0tleSBiYXNlNTggZW5jb2RlZCBFZDI1NTE5IHB1YmxpYyBrZXkgZm9yIHRoZSByZWNpcGllbnQgb2YgdGhlIFRyYW5zYWN0aW9uXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbanNvbj10cnVlXSBJZiB0cnVlIHJldHVybnMgYSBqc29uIG9iamVjdCBvdGhlcndpc2UgYSBjcnlwdG8tY29uZGl0aW9uIHR5cGVcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBFZDI1NTE5IENvbmRpdGlvbiAodGhhdCB3aWxsIG5lZWQgdG8gd3JhcHBlZCBpbiBhbiBPdXRwdXQpXG4gICAgICovXG4gICAgc3RhdGljIG1ha2VFZDI1NTE5Q29uZGl0aW9uKHB1YmxpY0tleSwganNvbiA9IHRydWUpIHtcbiAgICAgICAgY29uc3QgcHVibGljS2V5QnVmZmVyID0gQnVmZmVyLmZyb20oYmFzZTU4LmRlY29kZShwdWJsaWNLZXkpKTtcblxuICAgICAgICBjb25zdCBlZDI1NTE5RnVsZmlsbG1lbnQgPSBuZXcgY2MuRWQyNTUxOVNoYTI1NigpO1xuICAgICAgICBlZDI1NTE5RnVsZmlsbG1lbnQuc2V0UHVibGljS2V5KHB1YmxpY0tleUJ1ZmZlcik7XG5cbiAgICAgICAgaWYgKGpzb24pIHtcbiAgICAgICAgICAgIHJldHVybiBjY0pzb25pZnkoZWQyNTUxOUZ1bGZpbGxtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBlZDI1NTE5RnVsZmlsbG1lbnQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGFuIE91dHB1dCBmcm9tIGEgQ29uZGl0aW9uLlxuICAgICAqIE5vdGU6IEFzc3VtZXMgdGhlIGdpdmVuIENvbmRpdGlvbiB3YXMgZ2VuZXJhdGVkIGZyb20gYVxuICAgICAqIHNpbmdsZSBwdWJsaWMga2V5IChlLmcuIGEgRWQyNTUxOSBDb25kaXRpb24pXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbmRpdGlvbiBDb25kaXRpb24gKGUuZy4gYSBFZDI1NTE5IENvbmRpdGlvbiBmcm9tIGBtYWtlRWQyNTUxOUNvbmRpdGlvbigpYClcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gYW1vdW50IEFtb3VudCBvZiB0aGUgb3V0cHV0XG4gICAgICogQHJldHVybnMge09iamVjdH0gQW4gT3V0cHV0IHVzYWJsZSBpbiBhIFRyYW5zYWN0aW9uXG4gICAgICovXG4gICAgc3RhdGljIG1ha2VPdXRwdXQoY29uZGl0aW9uLCBhbW91bnQgPSBcIjFcIikge1xuICAgICAgICBpZiAodHlwZW9mIGFtb3VudCAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcImBhbW91bnRgIG11c3QgYmUgb2YgdHlwZSBzdHJpbmdcIik7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcHVibGljS2V5cyA9IFtdO1xuICAgICAgICBjb25zdCBnZXRQdWJsaWNLZXlzID0gZGV0YWlscyA9PiB7XG4gICAgICAgICAgICBpZiAoZGV0YWlscy50eXBlID09PSBcImVkMjU1MTktc2hhLTI1NlwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFwdWJsaWNLZXlzLmluY2x1ZGVzKGRldGFpbHMucHVibGljX2tleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcHVibGljS2V5cy5wdXNoKGRldGFpbHMucHVibGljX2tleSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChkZXRhaWxzLnR5cGUgPT09IFwidGhyZXNob2xkLXNoYS0yNTZcIikge1xuICAgICAgICAgICAgICAgIGRldGFpbHMuc3ViY29uZGl0aW9ucy5tYXAoZ2V0UHVibGljS2V5cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGdldFB1YmxpY0tleXMoY29uZGl0aW9uLmRldGFpbHMpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29uZGl0aW9uLFxuICAgICAgICAgICAgYW1vdW50OiBhbW91bnQsXG4gICAgICAgICAgICBwdWJsaWNfa2V5czogcHVibGljS2V5c1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIFByZWltYWdlLVNoYTI1NiBDcnlwdG9jb25kaXRpb24gZnJvbSBhIHNlY3JldCB0byBwdXQgaW50byBhbiBPdXRwdXQgb2YgYSBUcmFuc2FjdGlvblxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwcmVpbWFnZSBQcmVpbWFnZSB0byBiZSBoYXNoZWQgYW5kIHdyYXBwZWQgaW4gYSBjcnlwdG8tY29uZGl0aW9uXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbanNvbj10cnVlXSBJZiB0cnVlIHJldHVybnMgYSBqc29uIG9iamVjdCBvdGhlcndpc2UgYSBjcnlwdG8tY29uZGl0aW9uIHR5cGVcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBQcmVpbWFnZS1TaGEyNTYgQ29uZGl0aW9uICh0aGF0IHdpbGwgbmVlZCB0byB3cmFwcGVkIGluIGFuIE91dHB1dClcbiAgICAgKi9cbiAgICBzdGF0aWMgbWFrZVNoYTI1NkNvbmRpdGlvbihwcmVpbWFnZSwganNvbiA9IHRydWUpIHtcbiAgICAgICAgY29uc3Qgc2hhMjU2RnVsZmlsbG1lbnQgPSBuZXcgY2MuUHJlaW1hZ2VTaGEyNTYoKTtcbiAgICAgICAgc2hhMjU2RnVsZmlsbG1lbnQucHJlaW1hZ2UgPSBCdWZmZXIuZnJvbShwcmVpbWFnZSk7XG5cbiAgICAgICAgaWYgKGpzb24pIHtcbiAgICAgICAgICAgIHJldHVybiBjY0pzb25pZnkoc2hhMjU2RnVsZmlsbG1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzaGEyNTZGdWxmaWxsbWVudDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYW4gU2hhMjU2IFRocmVzaG9sZCBDcnlwdG9jb25kaXRpb24gZnJvbSB0aHJlc2hvbGQgdG8gcHV0IGludG8gYW4gT3V0cHV0IG9mIGEgVHJhbnNhY3Rpb25cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGhyZXNob2xkXG4gICAgICogQHBhcmFtIHtBcnJheX0gW3N1YmNvbmRpdGlvbnM9W11dXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbanNvbj10cnVlXSBJZiB0cnVlIHJldHVybnMgYSBqc29uIG9iamVjdCBvdGhlcndpc2UgYSBjcnlwdG8tY29uZGl0aW9uIHR5cGVcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBTaGEyNTYgVGhyZXNob2xkIENvbmRpdGlvbiAodGhhdCB3aWxsIG5lZWQgdG8gd3JhcHBlZCBpbiBhbiBPdXRwdXQpXG4gICAgICovXG4gICAgc3RhdGljIG1ha2VUaHJlc2hvbGRDb25kaXRpb24odGhyZXNob2xkLCBzdWJjb25kaXRpb25zID0gW10sIGpzb24gPSB0cnVlKSB7XG4gICAgICAgIGNvbnN0IHRocmVzaG9sZENvbmRpdGlvbiA9IG5ldyBjYy5UaHJlc2hvbGRTaGEyNTYoKTtcbiAgICAgICAgdGhyZXNob2xkQ29uZGl0aW9uLnRocmVzaG9sZCA9IHRocmVzaG9sZDtcblxuICAgICAgICBzdWJjb25kaXRpb25zLmZvckVhY2goc3ViY29uZGl0aW9uID0+IHtcbiAgICAgICAgICAgIC8vIFRPRE86IGFkZCBzdXBwb3J0IGZvciBDb25kaXRpb24gYW5kIFVSSXNcbiAgICAgICAgICAgIHRocmVzaG9sZENvbmRpdGlvbi5hZGRTdWJmdWxmaWxsbWVudChzdWJjb25kaXRpb24pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoanNvbikge1xuICAgICAgICAgICAgcmV0dXJuIGNjSnNvbmlmeSh0aHJlc2hvbGRDb25kaXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRocmVzaG9sZENvbmRpdGlvbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZW5lcmF0ZSBhIGBUUkFOU0ZFUmAgdHJhbnNhY3Rpb24gaG9sZGluZyB0aGUgYGFzc2V0YCwgYG1ldGFkYXRhYCwgYW5kIGBvdXRwdXRzYCwgdGhhdCBmdWxmaWxsc1xuICAgICAqIHRoZSBgZnVsZmlsbGVkT3V0cHV0c2Agb2YgYHVuc3BlbnRUcmFuc2FjdGlvbmAuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHVuc3BlbnRUcmFuc2FjdGlvbiBQcmV2aW91cyBUcmFuc2FjdGlvbiB5b3UgaGF2ZSBjb250cm9sIG92ZXIgKGkuZS4gY2FuIGZ1bGZpbGxcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0cyBPdXRwdXQgQ29uZGl0aW9uKVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBtZXRhZGF0YSBNZXRhZGF0YSBmb3IgdGhlIFRyYW5zYWN0aW9uXG4gICAgICogQHBhcmFtIHtPYmplY3RbXX0gb3V0cHV0cyBBcnJheSBvZiBPdXRwdXQgb2JqZWN0cyB0byBhZGQgdG8gdGhlIFRyYW5zYWN0aW9uLlxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgVGhpbmsgb2YgdGhlc2UgYXMgdGhlIHJlY2lwaWVudHMgb2YgdGhlIGFzc2V0IGFmdGVyIHRoZSB0cmFuc2FjdGlvbi5cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIEZvciBgVFJBTlNGRVJgIFRyYW5zYWN0aW9ucywgdGhpcyBzaG91bGQgdXN1YWxseSBqdXN0IGJlIGEgbGlzdCBvZlxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgT3V0cHV0cyB3cmFwcGluZyBFZDI1NTE5IENvbmRpdGlvbnMgZ2VuZXJhdGVkIGZyb20gdGhlIHB1YmxpYyBrZXlzIG9mXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgcmVjaXBpZW50cy5cbiAgICAgKiBAcGFyYW0gey4uLm51bWJlcn0gT3V0cHV0SW5kaWNlcyBJbmRpY2VzIG9mIHRoZSBPdXRwdXRzIGluIGB1bnNwZW50VHJhbnNhY3Rpb25gIHRoYXQgdGhpc1xuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRyYW5zYWN0aW9uIGZ1bGZpbGxzLlxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5vdGUgdGhhdCBsaXN0ZWQgcHVibGljIGtleXMgbGlzdGVkIG11c3QgYmUgdXNlZCAoYW5kIGluXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIHNhbWUgb3JkZXIpIHRvIHNpZ24gdGhlIFRyYW5zYWN0aW9uXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGBzaWduVHJhbnNhY3Rpb24oKWApLlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFVuc2lnbmVkIHRyYW5zYWN0aW9uIC0tIG1ha2Ugc3VyZSB0byBjYWxsIHNpZ25UcmFuc2FjdGlvbigpIG9uIGl0IGJlZm9yZVxuICAgICAqICAgICAgICAgICAgICAgICAgIHNlbmRpbmcgaXQgb2ZmIVxuICAgICAqL1xuICAgIC8vIFRPRE86XG4gICAgLy8gLSBNYWtlIGBtZXRhZGF0YWAgb3B0aW9uYWwgYXJndW1lbnRcbiAgICBzdGF0aWMgbWFrZVRyYW5zZmVyVHJhbnNhY3Rpb24odW5zcGVudE91dHB1dHMsIG91dHB1dHMsIG1ldGFkYXRhKSB7XG4gICAgICAgIGNvbnN0IGlucHV0cyA9IHVuc3BlbnRPdXRwdXRzLm1hcCh1bnNwZW50T3V0cHV0ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgdHgsIG91dHB1dEluZGV4IH0gPSB7XG4gICAgICAgICAgICAgICAgdHg6IHVuc3BlbnRPdXRwdXQudHgsXG4gICAgICAgICAgICAgICAgb3V0cHV0SW5kZXg6IHVuc3BlbnRPdXRwdXQub3V0cHV0X2luZGV4XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29uc3QgZnVsZmlsbGVkT3V0cHV0ID0gdHgub3V0cHV0c1tvdXRwdXRJbmRleF07XG4gICAgICAgICAgICBjb25zdCB0cmFuc2FjdGlvbkxpbmsgPSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0X2luZGV4OiBvdXRwdXRJbmRleCxcbiAgICAgICAgICAgICAgICB0cmFuc2FjdGlvbl9pZDogdHguaWRcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiBUcmFuc2FjdGlvbi5tYWtlSW5wdXRUZW1wbGF0ZShcbiAgICAgICAgICAgICAgICBmdWxmaWxsZWRPdXRwdXQucHVibGljX2tleXMsXG4gICAgICAgICAgICAgICAgdHJhbnNhY3Rpb25MaW5rXG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBhc3NldExpbmsgPSB7XG4gICAgICAgICAgICBpZDpcbiAgICAgICAgICAgICAgICB1bnNwZW50T3V0cHV0c1swXS50eC5vcGVyYXRpb24gPT09IFwiQ1JFQVRFXCJcbiAgICAgICAgICAgICAgICAgICAgPyB1bnNwZW50T3V0cHV0c1swXS50eC5pZFxuICAgICAgICAgICAgICAgICAgICA6IHVuc3BlbnRPdXRwdXRzWzBdLnR4LmFzc2V0LmlkXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBUcmFuc2FjdGlvbi5tYWtlVHJhbnNhY3Rpb24oXG4gICAgICAgICAgICBcIlRSQU5TRkVSXCIsXG4gICAgICAgICAgICBhc3NldExpbmssXG4gICAgICAgICAgICBtZXRhZGF0YSxcbiAgICAgICAgICAgIG91dHB1dHMsXG4gICAgICAgICAgICBpbnB1dHNcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaWduIHRoZSBnaXZlbiBgdHJhbnNhY3Rpb25gIHdpdGggdGhlIGdpdmVuIGBwcml2YXRlS2V5YHMsIHJldHVybmluZyBhIG5ldyBjb3B5IG9mIGB0cmFuc2FjdGlvbmBcbiAgICAgKiB0aGF0J3MgYmVlbiBzaWduZWQuXG4gICAgICogTm90ZTogT25seSBnZW5lcmF0ZXMgRWQyNTUxOSBGdWxmaWxsbWVudHMuIFRocmVzaG9sZHMgYW5kIG90aGVyIHR5cGVzIG9mIEZ1bGZpbGxtZW50cyBhcmUgbGVmdCBhc1xuICAgICAqIGFuIGV4ZXJjaXNlIGZvciB0aGUgdXNlci5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdHJhbnNhY3Rpb24gVHJhbnNhY3Rpb24gdG8gc2lnbi4gYHRyYW5zYWN0aW9uYCBpcyBub3QgbW9kaWZpZWQuXG4gICAgICogQHBhcmFtIHsuLi5zdHJpbmd9IHByaXZhdGVLZXlzIFByaXZhdGUga2V5cyBhc3NvY2lhdGVkIHdpdGggdGhlIGlzc3VlcnMgb2YgdGhlIGB0cmFuc2FjdGlvbmAuXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIExvb3BlZCB0aHJvdWdoIHRvIGl0ZXJhdGl2ZWx5IHNpZ24gYW55IElucHV0IEZ1bGZpbGxtZW50cyBmb3VuZCBpblxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgYHRyYW5zYWN0aW9uYC5cbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgc2lnbmVkIHZlcnNpb24gb2YgYHRyYW5zYWN0aW9uYC5cbiAgICAgKi9cbiAgICBzdGF0aWMgc2lnblRyYW5zYWN0aW9uKHRyYW5zYWN0aW9uLCAuLi5wcml2YXRlS2V5cykge1xuICAgICAgICBjb25zdCBzaWduZWRUeCA9IGNsb25lKHRyYW5zYWN0aW9uKTtcbiAgICAgICAgY29uc3Qgc2VyaWFsaXplZFRyYW5zYWN0aW9uID0gVHJhbnNhY3Rpb24uc2VyaWFsaXplVHJhbnNhY3Rpb25JbnRvQ2Fub25pY2FsU3RyaW5nKFxuICAgICAgICAgICAgdHJhbnNhY3Rpb25cbiAgICAgICAgKTtcblxuICAgICAgICBzaWduZWRUeC5pbnB1dHMuZm9yRWFjaCgoaW5wdXQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwcml2YXRlS2V5ID0gcHJpdmF0ZUtleXNbaW5kZXhdO1xuICAgICAgICAgICAgY29uc3QgcHJpdmF0ZUtleUJ1ZmZlciA9IEJ1ZmZlci5mcm9tKGJhc2U1OC5kZWNvZGUocHJpdmF0ZUtleSkpO1xuXG4gICAgICAgICAgICBjb25zdCB0cmFuc2FjdGlvblVuaXF1ZUZ1bGZpbGxtZW50ID0gaW5wdXQuZnVsZmlsbHNcbiAgICAgICAgICAgICAgICA/IHNlcmlhbGl6ZWRUcmFuc2FjdGlvblxuICAgICAgICAgICAgICAgICAgICAgIC5jb25jYXQoaW5wdXQuZnVsZmlsbHMudHJhbnNhY3Rpb25faWQpXG4gICAgICAgICAgICAgICAgICAgICAgLmNvbmNhdChpbnB1dC5mdWxmaWxscy5vdXRwdXRfaW5kZXgpXG4gICAgICAgICAgICAgICAgOiBzZXJpYWxpemVkVHJhbnNhY3Rpb247XG4gICAgICAgICAgICBjb25zdCB0cmFuc2FjdGlvbkhhc2ggPSBzaGEyNTZIYXNoKHRyYW5zYWN0aW9uVW5pcXVlRnVsZmlsbG1lbnQpO1xuICAgICAgICAgICAgY29uc3QgZWQyNTUxOUZ1bGZpbGxtZW50ID0gbmV3IGNjLkVkMjU1MTlTaGEyNTYoKTtcbiAgICAgICAgICAgIGVkMjU1MTlGdWxmaWxsbWVudC5zaWduKFxuICAgICAgICAgICAgICAgIEJ1ZmZlci5mcm9tKHRyYW5zYWN0aW9uSGFzaCwgXCJoZXhcIiksXG4gICAgICAgICAgICAgICAgcHJpdmF0ZUtleUJ1ZmZlclxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnN0IGZ1bGZpbGxtZW50VXJpID0gZWQyNTUxOUZ1bGZpbGxtZW50LnNlcmlhbGl6ZVVyaSgpO1xuXG4gICAgICAgICAgICBpbnB1dC5mdWxmaWxsbWVudCA9IGZ1bGZpbGxtZW50VXJpO1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBzZXJpYWxpemVkU2lnbmVkVHJhbnNhY3Rpb24gPSBUcmFuc2FjdGlvbi5zZXJpYWxpemVUcmFuc2FjdGlvbkludG9DYW5vbmljYWxTdHJpbmcoXG4gICAgICAgICAgICBzaWduZWRUeFxuICAgICAgICApO1xuICAgICAgICBzaWduZWRUeC5pZCA9IHNoYTI1Nkhhc2goc2VyaWFsaXplZFNpZ25lZFRyYW5zYWN0aW9uKTtcbiAgICAgICAgcmV0dXJuIHNpZ25lZFR4O1xuICAgIH1cbn1cbiJdfQ==