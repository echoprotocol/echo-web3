import semver from 'semver';

import EchoProvider from './providers/echojslib-provider';
import BridgeProvider from './providers/bridge-provider';
import EchoEthereumjsTx from './echo-ethereumjs-tx';
import { getWrappedEthWalletLib } from './echo-ethereumjs-wallet';
import * as constants from './constants';

/**
 *
 * @param {Web3} Web3Class
 * @return {{new(*=): WrappedWeb3, prototype: WrappedWeb3}}
 */
const wrapWeb3 = (Web3Class) => {

	if (semver.lt(Web3Class.version, constants.MIN_WEB3_VERSION)) {
		throw new Error(`A minimum provided Web3 version is ${constants.MIN_WEB3_VERSION}. You have provided ${Web3Class.version} version`);
	}

	return class WrappedWeb3 extends Web3Class {

		constructor(...args){
			super(...args);
			const { ethWallet, hdkey } = getWrappedEthWalletLib(this.currentProvider.echo);

			this.ethWallet = ethWallet;
			this.hdkey = hdkey;
		}

		createEthereumTransaction(ethereumTx) {
			return new EchoEthereumjsTx(ethereumTx, this.currentProvider);
		}

	};
};

/**
 *
 * @type {EchoProvider}
 */
wrapWeb3.echoProvider = EchoProvider;
wrapWeb3.bridgeProvider = BridgeProvider;

export default wrapWeb3;
