import { PrivateKey, serializers } from 'echojs-lib';
import { mapEthTxToEcho } from '../utils/transaction-utils';
import { isValidAddress, isValidData, isValidValue } from '../utils/validators';

class EthereumjsTx {

	/**
	 *
	 * @param {EthereumTransaction} ethereumTx
	 * @param {Echo} echo
	 * @param {Asset} asset
	 */
	constructor(ethereumTx, echo, asset) {
		this.echo = echo;
		this._validateTransaction(ethereumTx);
		const { operationId, options } = mapEthTxToEcho(ethereumTx, asset);
		/** @type {Transaction} */
		this._transaction = echo.createTransaction().addOperation(operationId, options);
	}

	/**
	 * sign transaction by privateKey
	 * @param privateKeyBuffer
	 * @return {Promise<void>}
	 */
	async sign(privateKeyBuffer) {
		const privateKey = PrivateKey.fromBuffer(privateKeyBuffer);
		await this._transaction.sign(privateKey);
	}

	/**
	 * get raw signed transaction in buffer
	 * @return {Buffer}
	 */
	serialize() {
		const serializedTransaction = serializers.signedTransaction.serialize(this._transaction.transactionObject);
		return Buffer.from(serializedTransaction);
	}

	_validateTransaction(ethereumTx) {
		if (typeof ethereumTx !== 'object') throw new Error('transaction is not an object');
		const { from, to, value, data } = ethereumTx;
		if(from && !isValidAddress(from)) throw new Error('invalid "form" field');
		if(to && !isValidAddress(to)) throw new Error('invalid "to" field');
		if(value && !isValidValue(value)) throw new Error('invalid "value" field');
		if(data && !isValidData(data)) throw new Error('invalid "data" field');
	}
}

export default EthereumjsTx;