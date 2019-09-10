/**
 * @abstract
 */
class Method {

	/**
	 *
	 * @param {Echo} echo
	 * @param {[]} params
	 * @param {Asset} asset
	 */
	constructor(echo, params, asset) {
		/**
		 * @type {Echo}
		 * @protected
		 * */
		this.echo = echo;
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

	get api(){
		if(!this.echo || !this.echo.api) throw new Error('echo api wasn\'t provided');
		return this.echo.api;
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
