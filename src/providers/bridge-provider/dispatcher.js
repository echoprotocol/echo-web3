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
	SendRawTransaction
} from '../methods';

import { GetNetwork, AccountsBridge, SendTransactionBridge } from './methods';

class BridgeDispatcher {

	/**
	 *
	 * @param extension
	 * @param {Echo} echoInstance
	 * @param {Asset} asset
	 */
	constructor(extension, echoInstance, asset) {
		this._extension = extension;
		this._echo = echoInstance;
		this._asset = asset;
	}

	/**
	 *
	 * @param method
	 * @param params
	 * @return {*}
	 */
	resolveMethod(method, params) {
		switch (method) {
			case 'eth_sendTransaction':
				return new SendTransactionBridge(this._extension, this._echo, params, this._asset);
			case 'eth_call':
				return new Call(this._echo, params, this._asset);
			case 'eth_getBlockByNumber':
				return new GetBlockByNumber(this._echo, params, this._asset);
			case 'eth_getBalance':
				return new GetBalance(this._echo, params, this._asset);
			case 'eth_blockNumber':
				return new BlockNumber(this._echo, params, this._asset);
			case 'eth_getTransactionCount':
				return new GetTransactionCount(this._echo, params, this._asset);
			case 'eth_getTransactionReceipt':
				return new GetTransactionReceipt(this._echo, params, this._asset);
			case 'eth_getLogs':
				return new GetLogs(this._echo, params, this._asset);
			case 'eth_getCode':
				return new GetCode(this._echo, params, this._asset);
			case 'eth_sendRawTransaction':
				return new SendRawTransaction(this._echo, params, this._asset);
			case 'net_version':
				return new GetNetwork(this._extension, this._echo, params, this._asset);
			default:
				return null;
		}
	}

	resolveSyncMethod(method, params) {
		switch (method) {
			case 'eth_accounts':
				return new AccountsBridge(this._extension, this._echo, params, this._asset);
			case 'eth_gasPrice':
				return new GasPrice(this._echo, params, this._asset);
			default:
				return null;
		}
	}

}

export default BridgeDispatcher;
