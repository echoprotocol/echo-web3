import { constants } from "echojs-lib";
import { shortMemoToAddress } from './address-utils';
import { addHexPrefix, weiValueToAssert } from './converters-utils';
import { NATHAN_ID } from '../constants/echo-constants'
import { isValidData, isValidTransactionHash } from './validators';

/**
 *
 * @param {EthereumTransaction} ethTx
 * @return {{contractId: string, registrar: string, code: string}}
 */
export const mapEthTxForCall = (ethTx) => {
	if (!ethTx) throw new Error('ethTx is empty');
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
export const mapEthTxToEcho = (ethTx, asset) => {
	// TODO move to ethereumjs-tx class?
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
		operationId = constants.OPERATIONS_IDS.CONTRACT_CALL
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
		operationId = constants.OPERATIONS_IDS.TRANSFER
	}

	return { options, operationId };
};

/**
 * @description encode echo broadcasting result to hash
 * hash structure: 0x[operationId 1b][blockNumber 4b][transactionIndex 2b]00000000000000000000000000000000000000000000000000
 * @param {BroadcastingResult} broadcastingResult
 * @return {String}
 */
export const encodeTxHash = (broadcastingResult) => {
	const hashBuffer = Buffer.alloc(32);
	const { block_num: blockNumber, trx_num: txIndex, trx: transactionInfo } = broadcastingResult;
	const [[operationId]] = transactionInfo.operations;
	hashBuffer.writeUInt8(operationId, 0);
	hashBuffer.writeUInt32LE(blockNumber, 1);
	hashBuffer.writeUInt16LE(txIndex, 5);
	return addHexPrefix(hashBuffer.toString('hex'));
};

/**
 * decode hash string to echo parameters for transaction identification
 * @param {String} hash
 * @return {{operationId: number, blockNumber: number, txIndex: number}}
 */
export const decodeTxHash = (hash) => {
	if (!isValidTransactionHash(hash)) throw new Error(`invalid tx hash string: ${hash}`);
	if(!/0{50}$/.test(hash)) throw new Error('invalid hex 64 symbols hash string');
	const hashBuffer = Buffer.from(hash.slice(2), 'hex');
	const operationId = hashBuffer.readUInt8(0);
	if (Object.values(constants.OPERATIONS_IDS).indexOf(operationId) === -1) {
		throw new Error(`unknown operationId ${operationId}`);
	}
	const blockNumber = hashBuffer.readUInt32LE(1);
	const txIndex = hashBuffer.readUInt16LE(5);
	return { operationId, blockNumber, txIndex };
};