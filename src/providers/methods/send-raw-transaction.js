import echo, { serializers } from 'echojs-lib';

import { isValidHex } from '../../utils/validators';
import { encodeTxHash } from '../../utils/transaction-utils';
import Method from '../abstract/method';
import { addHexPrefix, cutHexPrefix } from '../../utils/converters-utils';
class SendRawTransaction extends Method {

	/**
	 * make calculation and api call echo
	 * @return {Promise}
	 */
	async execute() {
		const transaction = this._formatInput();
		const broadcastResult = await echo.api.broadcastTransactionWithCallback(transaction, () => {});

		return this._formatOutput(broadcastResult);
	}

	/**
	 *
	 * @return {Object}
	 * @private
	 */
	_formatInput() {
		const [rawTx] = this.params;

		if (!isValidHex(rawTx)) {
			throw new Error('rawTx is not a valid hex');
		}

		const txBuffer = Buffer.from(cutHexPrefix(rawTx), 'hex');
		const deserializedTx = serializers.signedTransaction.deserialize(txBuffer);

		return deserializedTx;
	}

	/**
	 *
	 * @param result
	 * @return {String}
	 * @private
	 */
	_formatOutput(result) {
		const [{ block_num: blockNumber, trx_num: txIndex, trx: { operations: [[ operationId ]]} }] = result;

		return addHexPrefix(encodeTxHash(blockNumber, txIndex, operationId));
	}

}

export default SendRawTransaction;
