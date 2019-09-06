import Method from './method';
import { decodeAddress } from '../../../utils/address-utils';
import { assetValueToWei } from '../../../utils/converters-utils';
import { ETH_CONSTANTS } from '../../../constants';

class GetBalance extends Method {

	/**
	 * make calculation and api call echo
	 * @return {Promise}
	 */
	async execute() {
		const { accountId } = this._formatInput();

		const balanceResults = await this.echo.api.getAccountBalances(accountId, [this.asset.id]);
		const assetValue = balanceResults.find((item) => item.asset_id === this.asset.id);

		if (!assetValue || !balanceResults.length) {
			return this._formatOutput(0);
		}

		return this._formatOutput(assetValue.amount);
	}

	/**
	 *
	 * @return {{accountId: string}}
	 * @private
	 */
	_formatInput() {
		//TODO default block?
		const [ethAddress, defaultBlock] = this.params;

		if(defaultBlock !== ETH_CONSTANTS.DEFAULT_BLOCK){
			console.warn('method doesn\'t support "defaultBlock" parameter');
		}

		const accountId = decodeAddress(ethAddress.slice(2));

		return { accountId };
	}

	/**
	 *
	 * @param result
	 * @return {String}
	 * @private
	 */
	_formatOutput(result) {
		const weiBN = assetValueToWei(result, this.asset.precision);
		return this.web3Utils.toHex(weiBN);
	}

}

export default GetBalance;