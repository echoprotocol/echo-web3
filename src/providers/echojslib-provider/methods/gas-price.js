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
		return this._formatOutput(20000000000);
	}

	/**
	 *
	 * @param result
	 * @return {String}
	 * @private
	 */
	_formatOutput(result) {
		return this.web3Utils.toHex(result);
	}

}

export default GetBalance;