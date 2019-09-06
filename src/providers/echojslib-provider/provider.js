import echo, { constants } from 'echojs-lib';

import Dispatcher from './dispatcher';
import { ECHO_CONSTANTS } from '../../constants';


/** @typedef {
*	{
*  		id:String,
*  	    precision: Number|null
*  	}
* 	} Asset */

class EchoProvider {

	/**
	 *
	 * @param {String} host
	 * @param {ProviderOptions} options
	 */
	constructor(host, options = {}) {
		this._echo = echo;
		this.host = host;

		/** @type {Web3Utils} */
		this._web3Utils = null;

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
		if(!assetObject){
			throw new Error(`unknown asset id: ${this.asset.id}`);
		}

		this.asset.precision = assetObject.precision;

		/** @type {Dispatcher}*/
		this._dispatcher = new Dispatcher(echo, this._web3Utils, this.asset);
	}

	/**
	 *
	 * @return {Echo}
	 */
	get echo() {
		return this._echo;
	}

	/**
	 * pass utils functions from wrapped Web3 instance
	 * @param {Web3Utils} web3Utils
	 */
	setWeb3Utils(web3Utils) {
		this._web3Utils = web3Utils;
	}

	/**
	 * Should be used to make async request
	 *
	 * @method send
	 * @param {Object} payload
	 * @param {Function} callback triggered on end with (err, result)
	 */
	send(payload, callback) {

		if (!this._dispatcher) {
			return callback(new Error('Init provider first'));
		}

		const { method, params } = payload;
		const echoSpyMethod = this._dispatcher.resolveMethod(method, params);

		if (!echoSpyMethod) {
			throw new Error('method not implemented');
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
		// TODO return Promises
		this._echo.disconnect();
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
		if(error){
			return {
				id: payload.id,
				method: payload.method,
				jsonrpc:'2.0',
				error
			};
		}

		return {
			id: payload.id,
			method: payload.method,
			jsonrpc:'2.0',
			result
		};
	}


}

export default EchoProvider;
