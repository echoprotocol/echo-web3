import GetBalance from './methods/get-balance';
import GasPrice from './methods/gas-price';
import Call from './methods/call';
import GetTransactionCount from './methods/get-transaction-count';

class Dispatcher {

	/**
	 *
	 * @param {Echo} echoInstance
	 * @param {Asset} asset
	 */
	constructor(echoInstance, asset) {
		this._asset = asset;
		this._echo = echoInstance;
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
				return new GetBalance(this._echo, params, this._asset);
			case 'eth_gasPrice':
				return new GasPrice(this._echo, params, this._asset);
			case 'eth_call':
				return new Call(this._echo, params, this._asset);
			case 'eth_getTransactionCount':
				return new GetTransactionCount(this._echo, params, this._asset);
			default:
				return null;
		}
	}

}

export default Dispatcher;
