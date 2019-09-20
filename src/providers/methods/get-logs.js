import { constants } from 'echojs-lib';
import Method from './abstract/method';
import { addHexPrefix } from '../../utils/converters-utils';
import { isValidHex } from '../../utils/validators';
import BlockNumber from './block-number';
import { createRange } from '../../utils/range';
import { encodeBlockHash } from '../../utils/block-utils';
import { encodeTxHash } from '../../utils/transaction-utils';

class GetLogs extends Method {

	/**
	 * make calculation and api call echo
	 * @return {Promise}
	 */
	async execute() {
		const { fromBlock, toBlock } = await this._formatInput();

		const blockNumberRange = createRange(fromBlock, toBlock);
		const blocks = await Promise.all(blockNumberRange.map((number) => this.api.getBlock(number)));

		const logsIdentifiersArray = [];

		blocks.forEach((block) => {
			if(!block){
				return;
			}

			// get all transaction from block
			const { transactions, round: blockNumber } = block;

			transactions.forEach((tx, txIndex) => {
				const { operations, operation_results: operationResults } = tx;

				// track tx only with one operation had been created by echo-web3
				if (operations.length > 1) return;

				const [[operationId]] = operations;

				// explore only transactions with contract call and creating
				if (!(operationId === constants.OPERATIONS_IDS.CONTRACT_CALL || operationId === constants.OPERATIONS_IDS.CONTRACT_CREATE)) return;

				const [[, contractResultId]] = operationResults;

				logsIdentifiersArray.push({
					contractResultId,
					blockNumber,
					txIndex,
					operationId
				});

			});
		});

		// get all contractResults by found contractResultIds
		const contractResults = await Promise.all(logsIdentifiersArray.map(({contractResultId}) => this.api.getContractResult(contractResultId)));

		const results = [];

		contractResults.forEach((contractResult, i) => {
			const [, { tr_receipt: trReceipt }] = contractResult;
			const {txIndex, blockNumber, operationId} = logsIdentifiersArray[i];

			// take contractResults only with logs
			if (!trReceipt.log.length) return;

			trReceipt.log.forEach((log) => {
				const prevLog = results.length ? results[results.length - 1] : 0;
				// the logIndex sequentially increased for each log per each block
				const currentLogIndex = prevLog ? prevLog.blockNumber === blockNumber ? prevLog.logIndex + 1 : 0 : 0;

				results.push({
					blockNumber: blockNumber,
					logIndex: currentLogIndex,
					data: log.data,
					topics: log.log,
					address: log.address,
					txIndex: txIndex,
					operationId
				});
			});

		});

		return this._formatOutput(results);
	}

	/**
	 *
	 * @return {{options: {fromBlock: Number, toBlock: number}}}}
	 * @private
	 */
	async _formatInput() {
		// TODO https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getlogs add support for `address`, 'topics' and 'blockhash' options
		const [options] = this.params;
		if (typeof options !== 'object') throw new Error('options is not an object');

		const latestBlock = await (new BlockNumber(this.echo)).execute();

		let { fromBlock, toBlock } = options;

		if (isValidHex(fromBlock)) {
			fromBlock = Number(fromBlock);
		} else if (fromBlock === 'earliest') {
			fromBlock = 0;
		}

		if (isValidHex(toBlock)) {
			toBlock = Number(toBlock);
		} else if (toBlock === 'latest') {
			toBlock = latestBlock;
		}

		if (toBlock < fromBlock) throw new Error('toBlock is less than fromBlock');
		if (toBlock > latestBlock) throw new Error('toBlock is greater than head ECHO block');
		if (toBlock - fromBlock > 100) throw new Error('blocksDelta greater than 100');

		return { fromBlock, toBlock };
	}

	/**
	 *
	 * @param result
	 * @return [Object]
	 * @private
	 */
	_formatOutput(result) {
		return result.map((item)=>{
			const {
				blockNumber,
				logIndex,
				data,
				topics,
				address,
				txIndex,
				operationId
			} = item;

			return {
				blockNumber: addHexPrefix(blockNumber.toString(16)),
				blockHash: addHexPrefix(encodeBlockHash(blockNumber)),
				logIndex: addHexPrefix(logIndex.toString(16)),
				data: addHexPrefix(data),
				topics: topics.map((log)=>addHexPrefix(log)),
				address: addHexPrefix(address),
				transactionHash: addHexPrefix(encodeTxHash(blockNumber, txIndex, operationId)),
				txIndex: addHexPrefix(txIndex.toString(16))
			};
		});
	}


}

export default GetLogs;
