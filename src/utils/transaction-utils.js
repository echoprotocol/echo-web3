import { constants } from 'echojs-lib';
import { addressToShortMemo, shortMemoToAddress } from './address-utils';
import { addHexPrefix,cutHexPrefix, assetValueToWei, weiValueToAssert } from './converters-utils';
import { NATHAN_ID } from '../constants/echo-constants';
import { isValidData, isValidIdentificationHash } from './validators';
import { HASH_IDENTIFIERS } from '../constants';
import { encodeBlockHash } from './block-utils';

/**
 *
 * @param {EthereumTransaction} ethTx
 * @return {{contractId: string, registrar: string, code: string}}
 */
export const mapEthTxForCall = (ethTx) => {
	if (!ethTx || typeof ethTx !== 'object') throw new Error('transaction is not an object');
	const { to, data } = ethTx;
	if (data && !isValidData(data)) throw new Error('invalid "data" field');
	const contractId = shortMemoToAddress(to);
	return { contractId, registrar: NATHAN_ID, code: cutHexPrefix(data) };
};

/**
 *
 * @param {EthereumTransaction} ethTx
 * @param {Asset} asset
 * @return {{options, operationId}}
 */
export const mapEthTxToEcho = (ethTx, asset) => {
	const { from, to, data, value } = ethTx;
	let operationId = null;

	const options = {
		fee: {
			asset_id: asset.id
		},
	};

	const valueWithAssetAccuracyBN = weiValueToAssert(value, asset.precision);
	const valueWithAssetAccuracy = valueWithAssetAccuracyBN.toFixed(0) || 0;

	if (to && data) {
		options.callee = shortMemoToAddress(to);
		options.registrar = shortMemoToAddress(from);
		options.code = cutHexPrefix(data);
		options.value = { asset_id: asset.id, amount: valueWithAssetAccuracy };
		operationId = constants.OPERATIONS_IDS.CONTRACT_CALL;
	} else if (from && data) {
		options.registrar = shortMemoToAddress(from);
		options.code = cutHexPrefix(data);
		options.value = { asset_id: asset.id, amount: valueWithAssetAccuracy };
		operationId = constants.OPERATIONS_IDS.CONTRACT_CREATE;
		options.eth_accuracy = false;
	} else if (from && to) {
		options.to = shortMemoToAddress(to);
		options.from = shortMemoToAddress(from);
		options.amount = { asset_id: asset.id, amount: valueWithAssetAccuracy };
		operationId = constants.OPERATIONS_IDS.TRANSFER;
	} else {
		throw new Error('invalid eth tx object template');
	}

	return { options, operationId };
};


/**
 *
 * @param {Object} echoTx
 * @param blockNumber
 * @param txIndex
 * @return {*}
 */
export const mapEchoTxResultToEth = (echoTx, blockNumber, txIndex, asset) => {
	const { operations } = echoTx;
	const [[operationId, targetOperation]] = operations;

	const ethereumTransaction = {};
	ethereumTransaction.blockHash = addHexPrefix(encodeBlockHash(blockNumber));
	ethereumTransaction.blockNumber = blockNumber;
	ethereumTransaction.gas = 0;
	ethereumTransaction.gasPrice = 0;
	ethereumTransaction.hash = addHexPrefix(encodeTxHash(blockNumber, txIndex, operationId));
	ethereumTransaction.input =
	ethereumTransaction.nonce = 0;
	ethereumTransaction.transactionIndex = txIndex;
	ethereumTransaction.r = addHexPrefix();
	ethereumTransaction.s = addHexPrefix();
	ethereumTransaction.v = addHexPrefix();

	if(operationId === constants.OPERATIONS_IDS.CONTRACT_CALL){
		ethereumTransaction.to = addHexPrefix(addressToShortMemo(targetOperation.callee));
		ethereumTransaction.from = addHexPrefix(addressToShortMemo(targetOperation.registrar));
		ethereumTransaction.data = targetOperation.code;
		const valueWithAssetAccuracyBN = assetValueToWei(targetOperation.value.amount, asset.precision);
		ethereumTransaction.value = valueWithAssetAccuracyBN.toNumber();
	} else if (operationId === constants.OPERATIONS_IDS.CONTRACT_CREATE) {
		ethereumTransaction.from = addHexPrefix(addressToShortMemo(targetOperation.registrar));
		ethereumTransaction.data = targetOperation.code;
		const valueWithAssetAccuracyBN = assetValueToWei(targetOperation.value.amount, asset.precision);
		ethereumTransaction.value = valueWithAssetAccuracyBN.toNumber();
	} else if (operationId === constants.OPERATIONS_IDS.TRANSFER) {
		ethereumTransaction.from = addHexPrefix(addressToShortMemo(targetOperation.from));
		ethereumTransaction.to = addHexPrefix(addressToShortMemo(targetOperation.to));
		const valueWithAssetAccuracyBN = assetValueToWei(targetOperation.amount.amount, asset.precision);
		ethereumTransaction.value = valueWithAssetAccuracyBN.toNumber();
	}

	return ethereumTransaction;
};

/**
 *
 * @param {Object} echoTx
 * @param blockNumber
 * @param contractAddress
 * @param bloom
 * @param logs
 * @param transactionHash
 * @param transactionIndex
 * @return {*}
 */
export const mapEchoTxReceiptResultToEth = (echoTx, blockNumber, newAddress, bloom, logs, transactionHash, transactionIndex) => {
	const { operations } = echoTx;
	const [[operationId, targetOperation]] = operations;

	const ethereumTransactionReceipt = {};
	ethereumTransactionReceipt.blockHash = addHexPrefix(encodeBlockHash(blockNumber));
	ethereumTransactionReceipt.blockNumber = blockNumber;
	ethereumTransactionReceipt.contractAddress = newAddress ? addHexPrefix(newAddress) : newAddress;
	ethereumTransactionReceipt.logs = logs;
	ethereumTransactionReceipt.logsBloom = addHexPrefix(bloom ? bloom : new Array(512 + 1).join(0));
	ethereumTransactionReceipt.status = addHexPrefix(1);
	ethereumTransactionReceipt.transactionHash = transactionHash;
	ethereumTransactionReceipt.transactionIndex = transactionIndex;

	if(operationId === constants.OPERATIONS_IDS.CONTRACT_CALL){
		ethereumTransactionReceipt.to = addHexPrefix(addressToShortMemo(targetOperation.callee));
		ethereumTransactionReceipt.from = addHexPrefix(addressToShortMemo(targetOperation.registrar));
	} else if (operationId === constants.OPERATIONS_IDS.CONTRACT_CREATE) {
		ethereumTransactionReceipt.from = addHexPrefix(addressToShortMemo(targetOperation.registrar));
	} else if (operationId === constants.OPERATIONS_IDS.TRANSFER) {
		ethereumTransactionReceipt.from = addHexPrefix(addressToShortMemo(targetOperation.from));
		ethereumTransactionReceipt.to = addHexPrefix(addressToShortMemo(targetOperation.to));
	}

	return ethereumTransactionReceipt;
};

/**
 * @description encode echo transaction identification data to 32b hash
 * hash structure: [hashType 1b][operationId 1b][blockNumber 4b][transactionIndex 2b]000000000000000000000000000000000000000000000000
 * @return {String}
 * @param {Number} blockNumber
 * @param {Number} txIndex
 * @param {Number} operationId
 */
export const encodeTxHash = (blockNumber, txIndex, operationId) => {
	const hashBuffer = Buffer.alloc(32);
	hashBuffer.writeUInt8(HASH_IDENTIFIERS.TRANSACTION, 0);
	hashBuffer.writeUInt8(operationId, 1);
	hashBuffer.writeUInt32LE(blockNumber, 2);
	hashBuffer.writeUInt16LE(txIndex, 6);
	return hashBuffer.toString('hex');
};

/**
 * decode hash string to echo parameters for transaction identification
 * @param {String} hash
 * @return {{operationId: number, blockNumber: number, txIndex: number}}
 */
export const decodeTxHash = (hash) => {
	if (!isValidIdentificationHash(hash)) throw new Error(`invalid tx hash string: ${hash}`);
	if (!/0{48}$/.test(hash)) throw new Error('invalid hex 64 symbols hash string');
	const hashBuffer = Buffer.from(cutHexPrefix(hash), 'hex');
	const hashIdentifier = hashBuffer.readUInt8(0);
	const operationId = hashBuffer.readUInt8(1);
	const blockNumber = hashBuffer.readUInt32LE(2);
	const txIndex = hashBuffer.readUInt16LE(6);
	if (hashIdentifier !== HASH_IDENTIFIERS.TRANSACTION) {
		throw new Error('hash is not a transaction hash');
	}
	if (Object.values(constants.OPERATIONS_IDS).indexOf(operationId) === -1) {
		throw new Error(`unknown operationId ${operationId}`);
	}
	return { operationId, blockNumber, txIndex };
};
