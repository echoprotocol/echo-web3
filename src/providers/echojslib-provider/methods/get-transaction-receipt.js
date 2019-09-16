import Method from './method';
import { decodeTxHash } from '../../../utils/transaction-utils';
import { encodeBlockHash } from '../../../utils/block-utils';
import { mapEchoTxReceiptResultToEth } from '../../../utils/transaction-utils';

class GetTransactionReceipt extends Method {

	/**
	 * make calculation and api call echo
	 * @return {Promise}
	 */
	async execute() {
		const { blockNumber, txIndex, txHash } = this._formatInput();
		const transaction = await this.api.getTransaction(blockNumber, txIndex);

		const { operation_results: [[, resultContractId ]] } = transaction;
		const contractResult = await this.api.getContractResult(resultContractId);

		return this._formatOutput({ 
			transaction,
			contractResult,
			blockNumber,
			txHash,
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
		const { blockNumber, txIndex } = decodeTxHash(txHash);
		const blockHash = encodeBlockHash(blockNumber);

		return { blockNumber, txIndex, blockHash, txHash};
	}

	/**
	 *
	 * @param result
	 * @return {Object}
	 * @private
	 */
	_formatOutput(result) {
		const { transaction, contractResult, blockNumber, txHash, txIndex } = result;
		return mapEchoTxReceiptResultToEth(transaction, contractResult, blockNumber, txHash, txIndex);
	}

}

export default GetTransactionReceipt;