import { constants } from 'echojs-lib';
import { addressToShortMemo, shortMemoToAddress } from './address-utils';
import { addHexPrefix, assetValueToWei, weiValueToAssert } from './converters-utils';
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
	return { contractId, registrar: NATHAN_ID, code: data.slice(2) };
};

/**
 *
 * @param {EthereumTransaction} ethTx
 * @param {Asset} asset
 * @return {{options, operationId}}
 */
export const mapEthereumTxResultToEcho = (ethTx, asset) => {
	const { from, to, data, value } = ethTx;
	let operationId = null;

	const options = {
		fee: {
			asset_id: asset.id
		},
	};

	const valueWithAssetAccuracyBN = weiValueToAssert(value, asset.precision);
	const valueWithAssetAccuracy = valueWithAssetAccuracyBN.toNumber();

	if (from && to && data) {
		options.callee = shortMemoToAddress(to);
		options.registrar = shortMemoToAddress(from);
		options.code = data;
		options.value = { asset_id: asset.id, amount: valueWithAssetAccuracy };
		operationId = constants.OPERATIONS_IDS.CONTRACT_CALL;
	} else if (from && data) {
		options.registrar = shortMemoToAddress(from);
		options.code = data;
		options.value = { asset_id: asset.id, amount: valueWithAssetAccuracy };
		operationId = constants.OPERATIONS_IDS.CONTRACT_CREATE;
		options.eth_accuracy = false;
	} else if (from && to) {
		options.to = shortMemoToAddress(to);
		options.from = shortMemoToAddress(from);
		options.amount = { asset_id: asset.id, amount: valueWithAssetAccuracy };
		operationId = constants.OPERATIONS_IDS.TRANSFER;
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
	ethereumTransaction.blockHash = encodeBlockHash(blockNumber);
	ethereumTransaction.blockNumber = blockNumber;
	ethereumTransaction.gas = 0;
	ethereumTransaction.gasPrice = 0;
	ethereumTransaction.hash = encodeTxHash(blockNumber, txIndex, operationId);
	ethereumTransaction.input =
	ethereumTransaction.nonce = 0;
	ethereumTransaction.transactionIndex = txIndex;
	ethereumTransaction.r = addHexPrefix();
	ethereumTransaction.s = addHexPrefix();
	ethereumTransaction.v = addHexPrefix();

	if(operationId === constants.OPERATIONS_IDS.CONTRACT_CALL){
		ethereumTransaction.to = addressToShortMemo(targetOperation.callee);
		ethereumTransaction.from = addressToShortMemo(targetOperation.registrar);
		ethereumTransaction.data = targetOperation.code;
		const valueWithAssetAccuracyBN = assetValueToWei(targetOperation.value.amount, asset.precision);
		ethereumTransaction.value = valueWithAssetAccuracyBN.toNumber();
	} else if (operationId === constants.OPERATIONS_IDS.CONTRACT_CREATE) {
		ethereumTransaction.from = addressToShortMemo(targetOperation.registrar);
		ethereumTransaction.data = targetOperation.code;
		const valueWithAssetAccuracyBN = assetValueToWei(targetOperation.value.amount, asset.precision);
		ethereumTransaction.value = valueWithAssetAccuracyBN.toNumber();
	} else if (operationId === constants.OPERATIONS_IDS.TRANSFER) {
		ethereumTransaction.from = addressToShortMemo(targetOperation.from);
		ethereumTransaction.to = addressToShortMemo(targetOperation.to);
		const valueWithAssetAccuracyBN = assetValueToWei(targetOperation.amount.amount, asset.precision);
		ethereumTransaction.value = valueWithAssetAccuracyBN.toNumber();
	}

	return ethereumTransaction;
};

/**
 * @description encode echo transaction identification data to 32b hash
 * hash structure: 0x[hashType 1b][operationId 1b][blockNumber 4b][transactionIndex 2b]000000000000000000000000000000000000000000000000
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
	return addHexPrefix(hashBuffer.toString('hex'));
};

/**
 * decode hash string to echo parameters for transaction identification
 * @param {String} hash
 * @return {{operationId: number, blockNumber: number, txIndex: number}}
 */
export const decodeTxHash = (hash) => {
	if (!isValidIdentificationHash(hash)) throw new Error(`invalid tx hash string: ${hash}`);
	if (!/0{48}$/.test(hash)) throw new Error('invalid hex 64 symbols hash string');
	const hashBuffer = Buffer.from(hash.slice(2), 'hex');
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
