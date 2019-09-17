import {
	GetBalance,
	GasPrice,
	Call,
	GetTransactionCount,
	GetBlockByNumber,
	GetCode,
	BlockNumber,
	GetLogs,
	SendRawTransaction
} from './methods';

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
			case 'eth_call':
				return new Call(this._echo, params, this._asset);
			case 'eth_getBlockByNumber':
				return new GetBlockByNumber(this._echo, params, this._asset);
			case 'eth_getBalance':
				return new GetBalance(this._echo, params, this._asset);
			case 'eth_gasPrice':
				return new GasPrice(this._echo, params, this._asset);
			case 'eth_blockNumber':
				return new BlockNumber(this._echo, params, this._asset);
			case 'eth_getTransactionCount':
				return new GetTransactionCount(this._echo, params, this._asset);
			case 'eth_getLogs':
				return new GetLogs(this._echo, params, this._asset);
			case 'eth_getCode':
				return new GetCode(this._echo, params, this._asset);
			case 'etg_sendRawTransaction':
				return new SendRawTransaction(this._echo, params, this._asset);
			default:
				return null;
		}
	}

}

export default Dispatcher;
