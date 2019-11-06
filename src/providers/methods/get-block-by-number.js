import Method from '../abstract/method';
import { toDecimal } from '../../utils/converters-utils';
import { mapEchoBlockResultToEth } from '../../utils/block-utils';
import { isValidHex } from '../../utils/validators';
import BlockNumber from './block-number';

class GetBlockByNumber extends Method {

	/**
	 * make calculation and api call echo
	 * @return {Promise}
	 */
	async execute() {
		const { blockNumber, includeTx } = await this._formatInput();

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
	async _formatInput() {
		const [blockNumberHex, includeTx] = this.params;
		
		let blockNumber;
		if(isValidHex(blockNumberHex)){
			blockNumber = toDecimal(blockNumberHex);
		} else if (blockNumberHex === 'latest'){
			blockNumber = await (new BlockNumber(this.echo)).execute();
		} else{
			throw new Error('invalid block number');
		}

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