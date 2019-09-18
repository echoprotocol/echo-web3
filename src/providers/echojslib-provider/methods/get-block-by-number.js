import Method from './method';
import { toDecimal } from '../../../utils/converters-utils';
import { mapEchoBlockResultToEth } from '../../../utils/block-utils';
import { isValidHex } from '../../../utils/validators';

class GetBlockByNumber extends Method {

	/**
	 * make calculation and api call echo
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
		const [blockNumberHex, includeTx] = this.params;
		if(!isValidHex(blockNumberHex)){
			throw new Error('invalid block number');
		}

		const blockNumber = toDecimal(blockNumberHex);
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

export default GetBlockByNumber;