import { PrivateKey, serializers } from 'echojs-lib';
import { mapEthTxToEcho } from '../utils/transaction-utils';
import { isValidAddress, isValidData, isValidHex } from '../utils/validators';
import { generateAccountNameByPublicKey } from '../utils/address-utils';

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
		this._options = options;
		this._operationId = operationId;
		/** @type {Transaction} */
	}

	/**
	 * sign transaction by privateKey
	 * @param privateKeyBuffer
	 * @return {Promise<void>}
	 */
	async sign(privateKeyBuffer) {
		if(!this._options.from){
			// set registar  field from privateKey
			const echoPrivateKey = PrivateKey.fromBuffer(privateKeyBuffer);
			const publicKeyString = echoPrivateKey.toPublicKey().toPublicKeyString();
			const accountName = generateAccountNameByPublicKey(publicKeyString);
			const account = await this.echo.api.getAccountByName(accountName);
			if (!account) {
				throw new Error('account doesn\'t exist');
			}
			this._options.registrar = account.id;
		}

		this._transaction = this.echo.createTransaction()
			.addOperation(this._operationId, this._options);

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
		if (!ethereumTx || typeof ethereumTx !== 'object') throw new Error('transaction is not an object');
		const { from, to, value, data } = ethereumTx;
		if (from && !isValidAddress(from)) throw new Error('invalid "form" field');
		if (to && !isValidAddress(to)) throw new Error('invalid "to" field');
		if (value && !isValidHex(value)) throw new Error('invalid "value" field');
		if (data && !isValidData(data)) throw new Error('invalid "data" field');
	}

	hash() {
		throw new Error('not implemented');
	}

	getChainId() {
		throw new Error('not implemented');
	}

	getSenderAddress() {
		throw new Error('not implemented');
	}

	getSenderPublicKey() {
		throw new Error('not implemented');
	}

	verifySignature() {
		throw new Error('not implemented');
	}

	getDataFee() {
		throw new Error('not implemented');
	}

	getBaseFee() {
		throw new Error('not implemented');
	}

	getUpfrontCost() {
		throw new Error('not implemented');
	}

	validate() {
		throw new Error('not implemented');
	}

}

export default EthereumjsTx;