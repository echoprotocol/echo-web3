import { constants } from 'echojs-lib';

import Method from '../abstract/method';
import { isValidHex } from '../../utils/validators';
import { decodeTxHash } from '../../utils/transaction-utils';
import { mapEchoTxReceiptResultToEth } from '../../utils/transaction-utils';
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

		const { operation_results: [[, opertaionResultsId]], operations: [[operationId]] } = transaction;
		let bloom = null;
		let newAddress = null;

		if (operationId === constants.OPERATIONS_IDS.CONTRACT_CREATE ||
		operationId === constants.OPERATIONS_IDS.CONTRACT_CALL ||
		operationId === constants.OPERATIONS_IDS.CONTRACT_TRANSFER) {
			const contractResult = await this.api.getContractResult(opertaionResultsId);
			const [, { tr_receipt: trReceipt, exec_res: execRes }] = contractResult;
			({ bloom } = trReceipt);

			if (operationId === constants.OPERATIONS_IDS.CONTRACT_CREATE) {
				({ new_address: newAddress} = execRes);
			}
		}


		return await this._formatOutput({ 
			transaction,
			blockNumber,
			newAddress,
			bloom,
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
		const { transaction, blockNumber, newAddress, bloom, txHash, txIndex } = result;
		const logs = await (new GetLogs(this.echo, [{ fromBlock: blockNumber, toBlock: blockNumber }])).execute();

		return mapEchoTxReceiptResultToEth(transaction, blockNumber, newAddress, bloom, logs, txHash, txIndex);
	}

}

export default GetTransactionReceipt;