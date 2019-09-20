import BridgeMethod from '../../methods/abstract/bridge-method';

class GetNetwork extends BridgeMethod {

	constructor(...args){
		super(...args);

		this.networkMapping = {
			'': 1, // mainnet
			'e63b8287f9ae25a433dc4892e2f193167993c04f1f8b24aedce356a570f0facb': 3, // ropsten
			'1e68eb8828bd9053e14c9ee2ba89b0403be8e92be181782f797dd64c1b68dec6': 4 // rinkeby
		};
	}

	/**
	 * make calculation and api call echo
	 * @return {Promise}
	 */
	async execute() {
		const networkResult = await this.extension.getCurrentNetwork();
		return this._formatOutput(networkResult.chainId);
	}

	/**
	 * @param {String|Number|Object} result
	 * @override
	 * @protected
	 */
	_formatOutput(result) {
		return this.networkMapping[result];
	}

}

export default GetNetwork;
