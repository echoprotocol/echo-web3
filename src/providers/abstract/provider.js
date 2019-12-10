import { ECHO_CONSTANTS } from '../../constants';
import { createJsonRpcResponse } from '../../utils/json-rpc-utils';

class Provider {

	/**
	 *
	 * @param {String} host
	 * @param {ProviderOptions} options
	 */
	constructor(options = {}) {
		this._dispatcher = null;


		/** @type {Asset} */
		this.asset = {
			id: ECHO_CONSTANTS.DEFAULT_ASSET_ID || options.asset,
			precision: null
		};
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
		if (!this._dispatcher) {
			return new Error('Init provider first');
		}

		const { method, params } = payload;
		const echoSpyMethod = this._dispatcher.resolveSyncMethod(method, params);

		if (!echoSpyMethod) {
			throw new Error(`method ${method} not implemented, params ${JSON.stringify(params, null, 1)}`);
		}

		try {
			const result = echoSpyMethod.execute();
			return createJsonRpcResponse(payload.id, result);
		} catch (error) {
			const formattedError = `Error during execution of ${method}: ${error.message || error}`;
			return createJsonRpcResponse(payload.id, null, formattedError);
		}
	}

	/**
	 * Should be used to make async request
	 *
	 * @method send
	 * @param {Object} payload
	 * @param {Function} callback triggered on end with (err, result)
	 */
	sendAsync(payload, callback) {	
		console.log('TCL: sendAsync -> payload', payload);
		if (!this._dispatcher) {
			return callback(new Error('Init provider first'));
		}

		const { method, params } = payload;
		const echoSpyMethod = this._dispatcher.resolveMethod(method, params);

		if (!echoSpyMethod) {
			return callback(new Error(`method ${method} not implemented, params ${JSON.stringify(params, null, 1)}`));
		}

		echoSpyMethod.execute()
			.then(result => {
				return callback(null, createJsonRpcResponse(payload.id, result));
			})
			.catch(error => {
				const formattedError = `Error during execution of ${method}: ${error.message || error}`;
				return callback(createJsonRpcResponse(payload.id, null, formattedError));
			});

		return true;
	}

	disconnect() {
		return this._echo.disconnect();
	}

	/**
	 * init provider connection
	 * @return {Promise<void>}
	 */
	async _initAssetInfo() {
		const assetObject = await this.echo.api.getObject(this.asset.id);

		if (!assetObject || !assetObject.precision) {
			throw new Error(`unknown asset id: ${this.asset.id}`);
		}

		this.asset.precision = assetObject.precision;
	}

}

export default Provider;
