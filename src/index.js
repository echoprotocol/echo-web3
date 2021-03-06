import semver from 'semver';

import EchoProvider from './providers/echojslib-provider';
import BridgeProvider from './providers/bridge-provider';
import EthereumjsTx from './echo-ethereumjs-tx';
import { getEthWalletLib } from './echo-ethereumjs-wallet';
import * as constants from './constants';
import * as echojslib from 'echojs-lib';
import EchoPolyfill from './page-polyfill';

import {
	overrideWeb3CoreMethodsByBridge,
	overrideWeb3EthGetLogs
} from './web3-overrider.js';
import * as utils from './utils';

/** @typedef {
*	{
*  		from?: String
*  		to?: String
*  		value?: String
*  		data?: String
*  	}
* 	} EthereumTransaction */

/** @typedef {
*	{
*  		asset:String
*  	}
* 	} ProviderOptions */


/** @typedef {
*	{
*  		id:String,
*  	    precision: Number|null
*  	}
* 	} Asset */

/**
 *
 * @param {Web3} Web3Class
 * @return {{new(*=): WrappedWeb3, prototype: WrappedWeb3}}
 */
const EchoWeb3 = (Web3Class) => {

	return class WrappedWeb3 extends Web3Class {

		constructor(provider) {
			super();

			// check the minimal Web3 API version for  methods stable overriding
			if (semver.lt(this.version.api || this.version, constants.MIN_WEB3_API_VERSION)) {
				throw new Error(`A minimum provided Web3 API version is ${constants.MIN_WEB3_API_VERSION}. You have provided ${this.version.api} version`);
			}

			if (provider.isEchoProvider || provider._isBridgeCore) {
				if (provider._isBridgeCore) {
					overrideWeb3CoreMethodsByBridge(this, provider.extension);
				}

				overrideWeb3EthGetLogs(this, provider);
				// set provider if web3 version isn't least than supported and provider can works with echo network
				this.setProvider(provider);
			} else {
				throw new Error('You can pass only Echo compatibility provider');
			}

			// wrap Ethereumjs-wallet classes with connected ECHO instance
			this._ethereumjsWallet = getEthWalletLib(provider.echo);
		}

		get ethereumjsWallet() {
			return this._ethereumjsWallet;
		}

		set ethereumjsWallet(value) { }

		get EthereumjsTx() {
			const { echo, asset } = this.currentProvider;
			return class WrappedEthereumJs extends EthereumjsTx {
				constructor(template) {
					super(template, echo, asset);
				}
			};
		}

		/**
		 * disconnect from ECHO network
		 * @return {*}
		 */
		disconnect() {
			return this.currentProvider && this.currentProvider.disconnect();
		}

	};
};

export {
	EchoProvider,
	BridgeProvider,
	EthereumjsTx,
	utils,
	echojslib,
	EchoPolyfill
};

export default EchoWeb3;
