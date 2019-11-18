import Method from '../abstract/method';

class EstimateGas extends Method {

	/**
	 * make calculation and api call echo
	 * @return {Promise}
	 */
	async execute() {
		return this._formatOutput(21000);
	}


}

export default EstimateGas;