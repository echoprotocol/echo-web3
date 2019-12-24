import Method from '../abstract/method';
import { shortMemoToAddress } from '../../utils/address-utils';
import { assetValueToWei, cutHexPrefix } from '../../utils/converters-utils';
import { DEFAULT_ASSET_ID, KNOWN_ASSETS_PRECISION_MAP } from '../../constants/echo-constants';
class GetBalance extends Method {

	/**
	 * make calculation and api call echo
	 * @return {Promise}
	 */
	async execute() {
		const { accountId, assetId = DEFAULT_ASSET_ID} = this._formatInput();

		const balanceResults = await this.api.getAccountBalances(accountId, [assetId], true);
		const [assetValue] = balanceResults;

		if (!assetValue || !balanceResults.length) {
			return this._formatOutput(0);
		}

		return this._formatOutput({ rawAmount: assetValue.amount, assetId});
	}

	/**
	 *
	 * @return {{accountId: string}}
	 * @private
	 */
	_formatInput() {
		const [ethAddress, , assetId] = this.params;
		const accountId = shortMemoToAddress(cutHexPrefix(ethAddress));
		return { accountId, assetId };
	}

	/**
	 *
	 * @param result
	 * @return {BigNumber}
	 * @private
	 */
	_formatOutput(result) {
		const { rawAmount, assetId} = result; 
		const precision = KNOWN_ASSETS_PRECISION_MAP[assetId];
		return assetValueToWei(rawAmount, precision);
	}

}

export default GetBalance;