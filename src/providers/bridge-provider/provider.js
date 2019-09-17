
import Dispatcher from './dispatcher';
import { ECHO_CONSTANTS } from '../../constants';

class BridgeProvider {

	/**
	 *
	 * @param {String} host
	 * @param {ProviderOptions} options
	 */
	constructor(options = {}) {
		this.isEchoProvider = true;
		this._echo = window.echojslib.echo;
		this._extension = window.echojslib.extension;

		this._dispatcher = null;


		/** @type {Asset} */
		this.asset = {
			id: ECHO_CONSTANTS.DEFAULT_ASSET_ID || options.asset,
			precision: null
		};
	}

	async init() {
		await this.echo.extension.getAccess();
		// asset info initialization on provider init
		if (this.echo.isConnected) {
			await this.echo.disconnect();
		}
      
		await this.echo.connect();

		const assetObject = await this.echo.api.getObject(this.asset.id);
		if (!assetObject) {
			throw new Error(`unknown asset id: ${this.asset.id}`);
		}

		this.asset.precision = assetObject.precision;

		/** @type {Dispatcher}*/
		this._dispatcher = new Dispatcher(this.echo, this.asset);
	}

	/**
	 *
	 * @return {Echo}
	 */
	get echo() {
		return this._echo;
	}

	get extension() {
		return this._extension;
	}

	/**
	 *
	 * @param payload
	 */
	send(payload) {
		const { method } = payload;
		if(method === 'eth_gasPrice'){
			return this._wrapAsJsonRpcResponse(payload, '0x0');
		}
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
			return callback(`method ${method} not implemented, params ${JSON.stringify(params, null, 1)}`);
		}

		echoSpyMethod.execute()
			.then(result => {
				return callback(null, this._wrapAsJsonRpcResponse(payload, result));
			})
			.catch(error => {
				console.log(error);
				const formattedError = `Error during execution of ${method}: ${error}`;
				return callback(this._wrapAsJsonRpcResponse(payload, null, formattedError));
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

export default BridgeProvider;
