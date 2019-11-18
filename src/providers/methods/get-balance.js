import Method from '../abstract/method';
import { shortMemoToAddress } from '../../utils/address-utils';
import { assetValueToWei, cutHexPrefix } from '../../utils/converters-utils';


class GetBalance extends Method {

	/**
	 * make calculation and api call echo
	 * @return {Promise}
	 */
	async execute() {
		const { accountId } = this._formatInput();

		const balanceResults = await this.api.getAccountBalances(accountId, [this.asset.id]);
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
		const [ethAddress] = this.params;
		const accountId = shortMemoToAddress(cutHexPrefix(ethAddress));
		return { accountId };
	}

	/**
	 *
	 * @param result
	 * @return {BigNumber}
	 * @private
	 */
	_formatOutput(result) {
		return assetValueToWei(result, this.asset.precision);
	}

}

export default GetBalance;