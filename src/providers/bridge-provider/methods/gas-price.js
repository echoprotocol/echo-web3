import Method from './method';

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