/**
 *
 * @param {import('ethereumjs-wallet/hdkey')} OriginalHdkeyClass
 * @param WrappedWallet
 * @return {{new(): WrappedHdkey, prototype: WrappedHdkey}}
 */
const wrapHdkey = (OriginalHdkeyClass, WrappedWallet) => {

	return class WrappedHdkey extends OriginalHdkeyClass{
		getWallet(){
			if (this._hdkey._privateKey) {
				return WrappedWallet.fromPrivateKey(this._hdkey._privateKey);
			}
			return WrappedWallet.fromPublicKey(this._hdkey._publicKey, true);
		}
	};

};

export default wrapHdkey;