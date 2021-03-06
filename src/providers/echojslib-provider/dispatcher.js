import {
	GetBalance,
	GasPrice,
	Call,
	GetTransactionCount,
	GetTransactionReceipt,
	GetBlockByNumber,
	GetCode,
	BlockNumber,
	GetLogs,
	SendRawTransaction,
	GetBlockByHash,
	GetTransactionByHash,
	AccountKeys,
	EstimateGas,
	GetNetwork,
} from '../methods';

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
			case 'eth_getBlockByHash':
				return new GetBlockByHash(this._echo, params, this._asset);
			case 'eth_getBalance':
				return new GetBalance(this._echo, params, this._asset);
			case 'eth_sendRawTransaction':
				return new SendRawTransaction(this._echo, params, this._asset);
			case 'eth_blockNumber':
				return new BlockNumber(this._echo, params, this._asset);
			case 'eth_getTransactionCount':
				return new GetTransactionCount(this._echo, params, this._asset);
			case 'eth_getTransactionReceipt':
				return new GetTransactionReceipt(this._echo, params, this._asset);
			case 'eth_getTransactionByHash':
				return new GetTransactionByHash(this._echo, params, this._asset);
			case 'eth_getCode':
				return new GetCode(this._echo, params, this._asset);
			case 'eth_getLogs':
				return new GetLogs(this._echo, params, this._asset);
			case 'echo_accountKeys':
				return new AccountKeys(this._echo, params, this._asset);
			case 'eth_estimateGas':
				return new EstimateGas(this._echo, params, this._asset);
			case 'net_version':
				return new GetNetwork(this._echo, params, this._asset);
			default:
				return null;
		}
	}


	resolveSyncMethod(method, params) {
		switch (method) {
			case 'eth_gasPrice':
				return new GasPrice(this._echo, params, this._asset);
			default:
				return null;
		}
	}

}

export default Dispatcher;
