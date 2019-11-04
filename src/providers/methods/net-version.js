import Method from '../methods/abstract/method';
import { NETWORK_ID_MAPPING } from '../../constants';

class GetNetwork extends Method {

	/**
	 * make calculation and api call echo
	 * @return {Promise}
	 */
	async execute() {
		const chainId = await this.api.getChainId();
		return this._formatOutput(NETWORK_ID_MAPPING[chainId] || chainId);
	}

}

export default GetNetwork;
