import { constants } from 'echojs-lib';

import Method from '../abstract/method';
import { toDecimal } from '../../utils/converters-utils';
import { mapEchoBlockResultToEth } from '../../utils/block-utils';
import { isValidHex } from '../../utils/validators';
import BlockNumber from './block-number';
import { ECHO_CONSTANTS } from '../../constants';

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
	async _formatOutput(result) {
		const { block, blockNumber, includeTx } = result;
		const { transactions } = block;
		const assets = await Promise.all(transactions.map(async (transaction) => {
			const { operations } = transaction;
			const [[operationId, targetOperation]] = operations;

			if (operationId === constants.OPERATIONS_IDS.CONTRACT_CALL) {
				const [{ supported_asset_id: assetId }] = await this.echo.api.getContracts([targetOperation.callee]);
				const precision = ECHO_CONSTANTS.KNOWN_ASSETS_PRECISION_MAP[assetId];
				const asset = { id: assetId, precision };
				return asset;
			}
			return this.asset;

		}));
		return mapEchoBlockResultToEth(block, blockNumber, includeTx, assets);
	}

}

export default GetBlockByNumber;