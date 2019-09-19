import BridgeMethod from '../../methods/abstract/bridge-method';

class GetCode extends BridgeMethod {

	/**
	 * make calculation and api call echo
	 * @return {Promise}
	 */
	async execute() {
		const networkResult = await this.extension.getCurrentNetwork();
		return networkResult.chainId;
	}

}

export default GetCode;
