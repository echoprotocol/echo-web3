import Provider from '../abstract/provider';
import Dispatcher from './dispatcher';
import echo, { constants } from 'echojs-lib';

class EchoProvider extends Provider {

	/**
	 *
	 * @param {String} host
	 * @param {ProviderOptions} options
	 */
	constructor(host, options) {
		super(host, options);
		this.isEchoProvider = true;
		this.host = host;
		this._echo = echo;
	}

	/**
	 * init provider connection
	 * @return {Promise<void>}
	 */
	async init() {
		await this.echo.connect(this.host, { apis: constants.WS_CONSTANTS.CHAIN_APIS });

		await super._initAssetInfo();

		/** @type {Dispatcher}*/
		this._dispatcher = new Dispatcher(echo, this.asset);
	}

}

export default EchoProvider;
