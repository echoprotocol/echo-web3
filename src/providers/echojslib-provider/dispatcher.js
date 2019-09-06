import GetBalance from './methods/get-balance';

class Dispatcher {

	/**
	 *
	 * @param {Echo} echoInstance
	 * @param {Web3Utils} web3Utils
	 * @param {Asset} asset
	 */
	constructor(echoInstance, web3Utils, asset) {
		this._asset = asset;
		this._echo = echoInstance;
		this._web3Utils = web3Utils;
	}

	/**
	 *
	 * @param method
	 * @param params
	 * @return {*}
	 */
	resolveMethod(method, params) {
		switch (method) {
			case 'eth_getBalance':
				return new GetBalance(this._echo, this._web3Utils, params, this._asset);
			default:
				return null;
		}
	}

}

export default Dispatcher;
