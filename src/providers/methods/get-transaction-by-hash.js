import Method from './abstract/method';
import { isValidHex } from '../../utils/validators';
import { decodeTxHash, mapEchoTxResultToEth } from '../../utils/transaction-utils';

class GetTransactionByHash extends Method {

	/**
	 * make calculation and api call echo
	 * @return {Promise}
	 */
	async execute() {
		const { blockNumber, txIndex } = this._formatInput();
		const transaction = await this.api.getTransaction(blockNumber, txIndex);

		if (!transaction) {
			return null;
		}

		return await this._formatOutput({ 
			transaction,
			blockNumber,
			txIndex
		});
	}

	/**
	 *
	 * @return {{txHash: string}}
	 * @private
	 */
	_formatInput() {
		const [txHash] = this.params;

		if (!isValidHex(txHash)) {
			throw new Error('transactionHash is not a valid hex');
		}

		const { blockNumber, txIndex } = decodeTxHash(txHash);

		return { blockNumber, txIndex, txHash};
	}

	/**
	 *
	 * @param result
	 * @return {Object}
	 * @private
	 */
	async _formatOutput(result) {
		const { transaction, blockNumber, txIndex } = result;
		return mapEchoTxResultToEth(transaction, blockNumber, txIndex, this.asset);
	}

}

export default GetTransactionByHash;