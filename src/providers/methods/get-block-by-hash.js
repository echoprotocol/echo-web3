import Method from './abstract/method';
import { mapEchoBlockResultToEth, decodeBlockHash } from '../../utils/block-utils';
import { isValidHex } from '../../utils/validators';

class GetBlockByHash extends Method {

	/**
	 * @return {Promise}
	 */
	async execute() {
		const { blockNumber, includeTx } = this._formatInput();

		const block = await this.api.getBlock(blockNumber);

		if (!block) {
			return null;
		}

		return this._formatOutput({ block, blockNumber, includeTx });
	}

	/**
	 *
	 * @return {{blockNumber: number}}
	 * @private
	 */
	_formatInput() {
		const [blockHash, includeTx] = this.params;

		if (!isValidHex(blockHash)) {
			throw new Error('invalid block number');
		}

		const { blockNumber } = decodeBlockHash(blockHash);

		return { blockNumber, includeTx };
	}

	/**
	 *
	 * @param result
	 * @return {Object}
	 * @private
	 */
	_formatOutput(result) {
		const { block, blockNumber, includeTx } = result;
		return mapEchoBlockResultToEth(block, blockNumber, includeTx, this.asset);
	}

}

export default GetBlockByHash;