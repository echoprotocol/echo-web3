import BridgeMethod from '../../methods/abstract/bridge-method';
import { encodeTxHash, mapEthTxToEcho } from '../../../utils/transaction-utils';
import { addHexPrefix } from '../../../utils/converters-utils';

class SendTransactionBridge extends BridgeMethod {

	/**
	 * make calculation and api call echo
	 * @return {Promise}
	 */
	async execute() {
		const { options, operationId } = this._formatInput();

		const tx = this.echo.createTransaction()
			.addOperation(operationId, options);

		await tx.signWithBridge();

		const broadcastResult = await tx.broadcast();
		const [{block_num: blockNumber, trx_num: txIndex}] = broadcastResult;

		return this._formatOutput({blockNumber, txIndex, operationId});
	}

	/**
	 *
	 * @return {{options, operationId}}
	 * @private
	 */
	_formatInput() {
		const [ethTx] = this.params;
		return mapEthTxToEcho(ethTx, this.asset);
	}

	/**
	 *
	 * @param result
	 * @return {String}
	 * @private
	 */
	_formatOutput(result) {
		const {blockNumber, txIndex, operationId} = result;
		return addHexPrefix(encodeTxHash(blockNumber, txIndex, operationId));
	}

}

export default SendTransactionBridge;
