import Method from '../abstract/method';
import { addHexPrefix, cutHexPrefix } from '../../utils/converters-utils';
import { isValidAddress } from '../../utils/validators';
import BlockNumber from './block-number';
import { encodeBlockHash, decodeBlockHash } from '../../utils/block-utils';
import { shortMemoToAddress } from '../../utils/address-utils';

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

		const res = await this.api.getContractLogs(opts);

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
		let { fromBlock, toBlock, address, topics, blockHash } = options;

		if (address && !isValidAddress(address)) throw new Error('invalid address');

		if (blockHash) {
			const { blockNumber } = decodeBlockHash(blockHash);
			fromBlock = blockNumber;
			toBlock = blockNumber;
		} else {
			const latestBlock = await (new BlockNumber(this.echo)).execute();
		
			fromBlock = Number(fromBlock) || latestBlock;
			toBlock = Number(toBlock) || latestBlock;
		}

		if(fromBlock !== 1){
			// NOTE:: echo chain interpreters `[fromBlock, toBlock]` is empty range, if  fromBlock === toBlock
			// we need to decrease left side of range for getting of toBlock's logs
			// according with this behaviour we need to decrease fromBlock every time 
			fromBlock -= 1;
		}

		if (toBlock < fromBlock) throw new Error('toBlock is less than fromBlock');

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
