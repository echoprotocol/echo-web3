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
		// for compatibility with logic of frontend apps where MetaMask extension is used
		this.isMetaMask = true;
		// for private using of echo-web3
		this.isBridgeCore = true;
		const { echojslib } = window;
		if (!(echojslib && echojslib.isEchoBridge)) {
			throw new Error('Bridge extension wasn\'t provided');
		}

		this._echo = echojslib.echo;
		this._extension = echojslib.extension;

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
	 * @return {*}
	 */
	get extension() {
		return this._extension;
	}

	/**
	 * init provider connection
	 * @return {Promise<void>}
	 */
	async init() {
		// get access to echo instance and extension methods by clicking to Approve button in Bridge UI
		try {
			await this.extension.getAccess();
		} catch (error) {
			console.warn('The access to Bridge extension has been rejected previously. Clear your Bridge application data and try again.');
			throw error;
		}
		// asset info initialization on provider init
		if (this.echo.isConnected) {
			await this.echo.disconnect();
		}


		// connecting to Bridge's extension network
		await this.echo.connect();

		const assetObject = await this.echo.api.getObject(this.asset.id);

		if (!assetObject || !assetObject.precision) {
			throw new Error(`unknown asset id: ${this.asset.id}`);
		}

		this.asset.precision = assetObject.precision;

		/** @type {BridgeDispatcher}*/
		this._dispatcher = new BridgeDispatcher(this._extension, this._echo, this.asset);
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
		if (!this._dispatcher) {
			if (!this._dispatcher) {
				return callback(new Error('Init provider first'));
			}
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
