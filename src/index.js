import semver from 'semver';

import EchoProvider from './providers/echojslib-provider';
import BridgeProvider from './providers/bridge-provider';
import EthereumjsTx from './echo-ethereumjs-tx';
import { getWrappedEthWalletLib } from './echo-ethereumjs-wallet';
import * as constants from './constants';
import * as transactionUtils from './utils/transaction-utils';


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
			if (semver.lt(this.version.api, constants.MIN_WEB3_API_VERSION))
			{throw new Error(`A minimum provided Web3 API version is ${constants.MIN_WEB3_API_VERSION}. You have provided ${this.version.api} version`);}

			if (provider.isEchoProvider || provider.isBridgeProvider) {
				// set provider if web3 version isn't least than supported and provider can works with echo network
				this.setProvider(provider);
			} else {
				throw new Error('You can pass only Echo compatibility provider');
			}

			// wrap Ethereumjs-wallet classes with connected ECHO instance
			const { ethWallet, hdkey } = getWrappedEthWalletLib(provider.echo);
			this._ethWallet = ethWallet;
			this._hdkey = hdkey;

		}

		get ethWallet() {
			return this._ethWallet;
		}

		get hdKey() {
			return this._hdkey;
		}


		/**
		 *
		 * @param {EthereumTransaction} ethereumTx
		 * @return {EthereumjsTx}
		 */
		createEthereumTransaction(ethereumTx) {
			return new EthereumjsTx(ethereumTx, this.currentProvider.echo, this.currentProvider.asset);
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
	transactionUtils
};

export default EchoWeb3;
