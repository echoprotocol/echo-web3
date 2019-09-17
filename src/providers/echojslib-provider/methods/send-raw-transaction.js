import echo, { serializers } from 'echojs-lib';

import { encodeTxHash } from '../../../utils/transaction-utils';
import Method from './method';
class SendRawTransaction extends Method {

	/**
	 * make calculation and api call echo
	 * @return {Promise}
	 */
	async execute() {
		const transaction = this._formatInput();
		const bradcastResult = await echo.api.broadcastTransactionWithCallback(transaction, () => {});

		return this._formatOutput(bradcastResult);
	}

	/**
	 *
	 * @return {Object}
	 * @private
	 */
	_formatInput() {
		const [rawTx] = this.params;
		const txBuffer = Buffer.from(rawTx.slice(2), 'hex');
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

		return encodeTxHash(blockNumber, txIndex, operationId);
	}

}

export default SendRawTransaction;