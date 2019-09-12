import echo, { constants } from 'echojs-lib';

import Dispatcher from './dispatcher';
import { ECHO_CONSTANTS } from '../../constants';

class EchoProvider {

	/**
	 *
	 * @param {String} host
	 * @param {ProviderOptions} options
	 */
	constructor(host, options = {}) {
		this.isEchoProvider = true;
		this._echo = echo;
		this.host = host;

		this._dispatcher = null;


		/** @type {Asset} */
		this.asset = {
			id: ECHO_CONSTANTS.DEFAULT_ASSET_ID || options.asset,
			precision: null
		};
	}

	async init() {
		await this.echo.connect(this.host, { apis: constants.WS_CONSTANTS.CHAIN_APIS });

		// asset info initialization on provider init
		const assetObject = await this.echo.api.getObject(this.asset.id);
		if (!assetObject) {
			throw new Error(`unknown asset id: ${this.asset.id}`);
		}

		this.asset.precision = assetObject.precision;

		/** @type {Dispatcher}*/
		this._dispatcher = new Dispatcher(echo, this.asset);
	}

	/**
	 *
	 * @return {Echo}
	 */
	get echo() {
		return this._echo;
	}

	/**
	 *
	 * @param payload
	 */
	send(payload) {
		const { method } = payload;
		throw new Error(`The Echo-Web3 provider object does not support synchronous methods like ${method} without a callback parameter`);
	}

	/**
	 * Should be used to make async request
	 *
	 * @method send
	 * @param {Object} payload
	 * @param {Function} callback triggered on end with (err, result)
	 */
	sendAsync(payload, callback) {
		if (!this._dispatcher) {
			return callback(new Error('Init provider first'));
		}

		const { method, params } = payload;
		const echoSpyMethod = this._dispatcher.resolveMethod(method, params);

		if (!echoSpyMethod) {
			throw new Error(`method ${method} not implemented, 
			params ${JSON.stringify(params, null, 1)}`);
		}

		echoSpyMethod.execute()
			.then(result => {
				return callback(null, this._wrapAsJsonRpcResponse(payload, result));
			})
			.catch(error => {
				return callback(error);
			});
	}

	disconnect() {
		return this._echo.disconnect();
	}

	/**
	 *
	 * @param {{method: String, id: Number|String}} payload
	 * @param {*} result
	 * @param {*?} error
	 * @return {*}
	 * @private
	 */
	_wrapAsJsonRpcResponse(payload, result, error) {
		return {
			id: payload.id,
			jsonrpc: '2.0',
			...error ? { error } : { result }
		};
	}


}

export default EchoProvider;
