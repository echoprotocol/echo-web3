import EthWallet from 'ethereumjs-wallet';
import Hdkey from 'ethereumjs-wallet/hdkey';

import wrapEthWallet from './ethWallet';
import wrapHdkey from './hdkey';

/**
 * inject echo instance into ethereumjs-wallet's classes
 *
 * @param echo
 * @return {{ethWallet: EthWallet, hdkey: Hdkey}}
 */
export const getEthWalletLib = (echo) => {
	const wrappedEthWalletClass = wrapEthWallet(EthWallet, echo);
	const wrappedHdkeyClass = wrapHdkey(Hdkey, wrappedEthWalletClass);

	return {
		ethWallet: wrappedEthWalletClass,
		hdKey: wrappedHdkeyClass
	};
};

