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
export const getWrappedEthWalletLib = (echo) => {
	const wrappedEthWalletClass = wrapEthWallet(EthWallet, echo);
	const wrappedHdkeyClass = wrapHdkey(Hdkey, wrappedEthWalletClass, echo);
	// TODO impl the same wrapping for provider-engine and thirdparty modules

	return {
		ethWallet: wrappedEthWalletClass,
		hdkey: wrappedHdkeyClass
	};
};

