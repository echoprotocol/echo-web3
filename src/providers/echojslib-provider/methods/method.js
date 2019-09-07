/**
 * @abstract
 */
class Method {

	/**
	 *
	 * @param {Echo} echo
	 * @param {Object} web3Utils
	 * @param {[]} params
	 * @param {Asset} asset
	 */
	constructor(echo, web3Utils, params, asset) {
		/**
		 * @type {Echo}
		 * @protected
		 * */
		this.echo = echo;
		/**
		 * @type {Web3Utils}
		 * @protected
		 * */
		this.web3Utils = web3Utils;
		/**
		 * @type {[]}
		 * @protected
		 * */
		this.params = params;
		/**
		 * @type {Asset}
		 * @protected
		 * */
		this.asset = asset;
	}

	/**
	 * make calculation and api call echo
	 * @abstract
	 * @return {Promise}
	 */
	execute() {

	}

	/**
	 * @override
	 * @protected
	 */
	_formatInput() {
		return this.params;
	}

	/**
	 * @override
	 * @protected
	 */
	_formatOutput(result) {
		return result;
	}

}

export default Method;
