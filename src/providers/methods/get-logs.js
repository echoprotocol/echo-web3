import Method from './abstract/method';
import { addHexPrefix, cutHexPrefix } from '../../utils/converters-utils';
import { isValidHex } from '../../utils/validators';
import BlockNumber from './block-number';
import { encodeBlockHash, decodeBlockHash } from '../../utils/block-utils';
import { shortMemoToAddress } from '../../utils/address-utils';
import { encodeTxHash } from '../../utils/transaction-utils';

class GetLogs extends Method {

	/**
	 * make calculation and api call echo
	 * @return {Promise}
	 */
	async execute() {
		const { fromBlock, toBlock, address, topics } = await this._formatInput();
		const opts = {
			fromBlock,
			toBlock
		};

		if (address) {
			opts.contracts = [shortMemoToAddress(address)];
		}

		if (topics) {
			opts.topics = topics.map((topic) => cutHexPrefix(topic));
		}

		const res = await this.api.getContractLogs2(opts);

		return this._formatOutput(res);
	}

	/**
	 *
	 * @return {{options: {fromBlock: Number, toBlock: number}}}}
	 * @private
	 */
	async _formatInput() {
		const [options] = this.params;

		if (typeof options !== 'object') throw new Error('options is not an object');

		const latestBlock = await (new BlockNumber(this.echo)).execute();

		let { fromBlock, toBlock, address, topics, blockHash } = options;


		if (blockHash) {
			const { blockNumber } = decodeBlockHash(blockHash);
			fromBlock = blockNumber;
			toBlock = blockNumber;
		} else {
			fromBlock = isValidHex(fromBlock) ? Number(fromBlock) : latestBlock;
			toBlock = isValidHex(toBlock) ? Number(toBlock) : latestBlock;

			//TODO 
			if (toBlock === fromBlock) {
				fromBlock -= 1;
			}

			if (toBlock < fromBlock) throw new Error('toBlock i s less than fromBlock');
			if (toBlock > latestBlock) throw new Error('toBlock is greater than head ECHO block');
		}

		return { fromBlock, toBlock, address, topics };
	}

	/**
	 *
	 * @param result
	 * @return [Object]
	 * @private
	 */
	_formatOutput(result) {
		const ko = result.map(([, item], i) => {
			const {
				block_num: blockNumber,
				data,
				log: topics,
				address,
				trx_num: txIndex,
			} = item;

			return {
				blockNumber: addHexPrefix(blockNumber.toString(16)),
				blockHash: addHexPrefix(encodeBlockHash(blockNumber)),
				logIndex: addHexPrefix(i.toString(16)),
				data: addHexPrefix(data),
				topics: topics.map((log) => addHexPrefix(log)),
				address: addHexPrefix(address),
				transactionHash: '0x',//addHexPrefix(encodeTxHash(blockNumber, txIndex, operationId)),
				transactionIndex: addHexPrefix(txIndex.toString(16))
			};
		});
		return ko;
	}


}

export default GetLogs;
