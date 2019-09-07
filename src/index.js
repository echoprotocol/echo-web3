import semver from 'semver';

import EchoProvider from './providers/echojslib-provider';
import BridgeProvider from './providers/bridge-provider';
import EchoEthereumjsTx from './echo-ethereumjs-tx';
import { getWrappedEthWalletLib } from './echo-ethereumjs-wallet';
import * as constants from './constants';

/** @typedef {
*	{
*  		asset:String
*  	}
* 	} ProviderOptions */

/** @typedef {
*	{
*  		toHex: Function
*  		toBigNumber: Function
*  	}
* 	} Web3Utils */

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
				throw new Error(`A minimum provided Web3 API version is ${constants.MIN_WEB3_API_VERSION}. You have provided ${this.version.api} version`);

			// set provider if web3 version isn't least than supported
			this.setProvider(provider);

			// wrap Ethereumjs-wallet classes with connected ECHO instance
			const { ethWallet, hdkey } = getWrappedEthWalletLib(provider.echo);
			this._ethWallet = ethWallet;
			this._hdkey = hdkey;

			// the extractions of utils(encoders, formatters, etc.) from original web3 instance
			const { toHex, toBigNumber } = this;
			this.currentProvider.setWeb3Utils({ toHex, toBigNumber });
		}

		get ethWallet() {
			return this._ethWallet;
		}

		get hdKey() {
			return this._hdkey;
		}

		createEthereumTransaction(ethereumTx) {
			return new EchoEthereumjsTx(ethereumTx, this.currentProvider);
		}

		disconnect(){
			return (this.currentProvider && this.currentProvider.disconnect());
		};

	};
};

export {
	EchoProvider
}

export default EchoWeb3;
