import echo, {constants} from 'echojs-lib';

import Dispatcher from './dispatcher';
import {ECHO_CONSTANTS} from '../../constants';

class EchoProvider {
	/**
	 *
	 * @param {String} host
	 * @param {Object} options
	 * @param {String} options.asset
	 */
	constructor(host, options = {}) {
		this._echo = echo;
		this.host = host;

		this.dispatcher = null;

		this.asset = ECHO_CONSTANTS.DEFAULT_ASSET_ID || options.asset;
	}

	async init() {
		// TODO:: need to pass options?
		await this.echo.connect(this.host, {apis: constants.WS_CONSTANTS.CHAIN_APIS});
		/** @type {Dispatcher}*/
		this.dispatcher = new Dispatcher(echo);
	}

	/**
	 *
	 * @return {echo | *}
	 */
	get echo() {
		return this._echo;
	}

	/**
	 * Should be used to make async request
	 *
	 * @method send
	 * @param {Object} payload
	 * @param {Function} callback triggered on end with (err, result)
	 */
	send(payload, callback) {

		if (!this.dispatcher) {
			return callback(new Error('Init provider first'));
		}

		const { method, params } = payload;
		const dispatchMethod = this.dispatcher.resolveMethod(method);

		if (!dispatchMethod) {
			throw new Error('method not implemented');
		}

		dispatchMethod(params)
			.then(result => {
				return callback(null, result);
			})
			.catch(error => {
				return callback(error);
			});

	}

	disconnect() {
		this._echo.disconnect()
	}


}

export default EchoProvider;
