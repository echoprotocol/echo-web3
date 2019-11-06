import { addressToShortMemo } from '../../utils/address-utils';
import { addHexPrefix } from '../../utils/converters-utils';
import Provider from '../abstract/provider';
import BridgeDispatcher from './dispatcher';

class BridgeProvider extends Provider{

	/**
	 *
	 * @param {String} host
	 * @param {ProviderOptions} options
	 */
	constructor(options = {}) {
		super('', options);
		// for compatibility with logic of frontend apps where MetaMask extension is used
		this.isMetaMask = true;
		// for private using of echo-web3
		this._isBridgeCore = true;
		const { echojslib } = window;
		if (!(echojslib && echojslib.isEchoBridge)) {
			throw new Error('Bridge extension wasn\'t provided');
		}

		this._echo = echojslib.echo;
		this._extension = echojslib.extension;
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
		if (this.echo.isConnected) {
			await this.echo.disconnect();
		}

		// connecting to Bridge's extension network
		await this.echo.connect();

		await super._initAssetInfo();

		/** @type {BridgeDispatcher}*/
		this._dispatcher = new BridgeDispatcher(this._extension, this._echo, this.asset);
	}

	async enable() {
		await this.extension.getAccess();
		const accounts = await this.extension.getAccounts();
		return accounts.map((account) => addHexPrefix(addressToShortMemo(account.id)));
	}

}

export default BridgeProvider;
