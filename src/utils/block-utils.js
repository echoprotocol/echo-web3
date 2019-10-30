import { addHexPrefix, cutHexPrefix } from './converters-utils';
import { isValidIdentificationHash } from './validators';
import { HASH_IDENTIFIERS } from '../constants';
import { encodeTxHash, mapEchoTxResultToEth } from './transaction-utils';
import { addressToShortMemo } from './address-utils';

/**
 * @description encode echo block number to 32b hash
 * hash structure: [hashType 1b][blockNumber 4b]000000000000000000000000000000000000000000000000000000
 * @param {Number} blockNumber
 * @return {String}
 */
export const encodeBlockHash = (blockNumber) => {
	const hashBuffer = Buffer.alloc(32);
	hashBuffer.writeUInt8(HASH_IDENTIFIERS.BLOCK, 0);
	hashBuffer.writeUInt32LE(blockNumber, 1);
	return hashBuffer.toString('hex');
};

/**
 * decode hash string to echo parameters for block identification
 * @param {String} hash
 * @return {{blockNumber: number}}
 */
export const decodeBlockHash = (hash) => {
	if (!isValidIdentificationHash(hash)) throw new Error(`invalid block hash string: ${hash}`);
	if (!/0{54}$/.test(hash)) throw new Error('invalid hex 64 symbols hash string');
	const hashBuffer = Buffer.from(cutHexPrefix(hash), 'hex');
	const hashIdentifier = hashBuffer.readUInt8(0);
	const blockNumber = hashBuffer.readUInt32LE(1);
	if (hashIdentifier !== HASH_IDENTIFIERS.BLOCK) {
		throw new Error('hash is not a transaction hash');
	}
	return { blockNumber };
};


export const mapEchoBlockResultToEth = (echoBlock, blockNumber, includeTxObjects, asset) => {
	const { transactions, transaction_merkle_root: txRoot, account, timestamp } = echoBlock;

	const blockHash = addHexPrefix(encodeBlockHash(blockNumber));
	const ethereumBlock = {};
	ethereumBlock.difficulty = addHexPrefix(0);
	ethereumBlock.extraData = addHexPrefix();
	ethereumBlock.gasLimit = addHexPrefix(0);
	ethereumBlock.gasUsed = addHexPrefix(0);
	ethereumBlock.hash = blockHash;
	ethereumBlock.logsBloom = addHexPrefix();
	ethereumBlock.miner = addHexPrefix(addressToShortMemo(account));
	ethereumBlock.mixHash = addHexPrefix();
	ethereumBlock.nonce = addHexPrefix();
	ethereumBlock.number = blockNumber;
	ethereumBlock.parentHash = addHexPrefix(encodeBlockHash(blockNumber - 1));
	ethereumBlock.receiptsRoot = addHexPrefix();
	ethereumBlock.sha3Uncles = addHexPrefix();
	ethereumBlock.size = JSON.stringify(echoBlock).length; // TODO need to serialize to buffer ang get the length from it
	ethereumBlock.stateRoot = addHexPrefix();
	ethereumBlock.timestamp = parseInt(new Date(timestamp).getTime() / 1000, 10);
	ethereumBlock.totalDifficulty = addHexPrefix(0);
	ethereumBlock.transactionsRoot = addHexPrefix(txRoot);
	ethereumBlock.uncles = [];
	if (includeTxObjects) {
		// fill the transaction field by transaction's objects
		ethereumBlock.transactions = transactions.map((echoTx, i) => mapEchoTxResultToEth(echoTx, blockNumber, i, asset));
	} else {
		// fill the transaction field by transaction's hashes
		ethereumBlock.transactions = transactions.map((echoTx, i) => {
			const [[operationId]] = echoTx.operations;
			return addHexPrefix(encodeTxHash(blockNumber, i, operationId));
		});
	}

	return ethereumBlock;
};

export const inputBlockNumberFormatter = (blockNumber) => {
	if (blockNumber === undefined) {
		return undefined;
	}

	return addHexPrefix(blockNumber.toString(16));
};