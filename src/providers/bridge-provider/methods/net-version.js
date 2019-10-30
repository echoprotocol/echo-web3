import BridgeMethod from '../../methods/abstract/bridge-method';
import { NETWORK_ID_MAPPING } from '../../../constants';

class GetNetwork extends BridgeMethod {

	/**
	 * make calculation and api call echo
	 * @return {Promise}
	 */
	async execute() {
		const networkResult = await this.extension.getCurrentNetwork();
		return this._formatOutput(this.NETWORK_ID_MAPPING[networkResult.chainId] || networkResult.chainId);
	}

}

export default GetNetwork;
