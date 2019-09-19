import BridgeDispatcher from './dispatcher';
import { ECHO_CONSTANTS } from '../../constants';
import { addressToShortMemo } from '../../utils/address-utils';
import { addHexPrefix } from '../../utils/converters-utils';

class BridgeProvider {

	/**
	 *
	 * @param {String} host
	 * @param {ProviderOptions} options
	 */
	constructor(options = {}) {
		this.isBridgeProvider = true;
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
		// get access to echo instance and extension methods by clicking to Approve button in Bridge UI

		try {
			await this.extension.getAccess();
		} catch (e) {
			console.warn('The access to Bridge extension has been rejected previously. Clear your Bridge application data and try again.');
			throw e;
		}
		// asset info initialization on provider init
		if (this.echo.isConnected) {
			await this.echo.disconnect();
		}


		// connecting to Bridge's extension network
		await this.echo.connect();

		const assetObject = await this.echo.api.getObject(this.asset.id);

		if (!assetObject) {
			throw new Error(`unknown asset id: ${this.asset.id}`);
		}

		this.asset.precision = assetObject.precision;

		/** @type {BridgeDispatcher}*/
		this._dispatcher = new BridgeDispatcher(this._extension, this._echo, this.asset);
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
		console.log('send');
		console.log(payload);

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
			return this._wrapAsJsonRpcResponse(payload, result);
		} catch (error) {
			const formattedError = `Error during execution of ${method}: ${error}`;
			return this._wrapAsJsonRpcResponse(payload, null, formattedError);
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
		console.log('sendAsync');
		console.log(payload);

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

	async enable() {
		const accounts = await this.extension.getAccounts();
		return accounts.map((account) => addHexPrefix(addressToShortMemo(account.id)));
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
