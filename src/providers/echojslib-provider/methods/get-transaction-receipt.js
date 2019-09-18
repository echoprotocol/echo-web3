import { constants } from 'echojs-lib';

import Method from './method';
import { isValidHex } from '../../../utils/validators';
import { decodeTxHash } from '../../../utils/transaction-utils';
import { mapEchoTxReceiptResultToEth } from '../../../utils/transaction-utils';
import GetLogs from './get-logs';

class GetTransactionReceipt extends Method {

	/**
	 * make calculation and api call echo
	 * @return {Promise}
	 */
	async execute() {
		const { blockNumber, txIndex, txHash } = this._formatInput();
		const transaction = await this.api.getTransaction(blockNumber, txIndex);

		if (!transaction) {
			return null;
		}

		const { operation_results: [[, resultContractId]], operations: [[operationId]] } = transaction;
		let bloom = null;

		if (operationId === constants.OPERATIONS_IDS.CONTRACT_CREATE ||
		operationId === constants.OPERATIONS_IDS.CONTRACT_CALL ||
		operationId === constants.OPERATIONS_IDS.CONTRACT_TRANSFER) {
			const contractResult = await this.api.getContractResult(resultContractId);

			const [, { tr_receipt: trReceipt }] = contractResult;
			({ bloom } = trReceipt);
		}

		return await this._formatOutput({ 
			transaction,
			bloom,
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

		if (!isValidHex(txHash)) {
			throw new Error('transactionHash is not an valid hex');
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
		const { transaction, blockNumber, bloom, txHash, txIndex } = result;
		const logs = await (new GetLogs(this.echo, [{ fromBlock: blockNumber, toBlock: blockNumber }])).execute();

		return mapEchoTxReceiptResultToEth(transaction, blockNumber, bloom, logs, txHash, txIndex);
	}

}

export default GetTransactionReceipt;