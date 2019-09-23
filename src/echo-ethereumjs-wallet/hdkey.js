import HDKey from 'hdkey';

/**
 *
 * @param OriginalHdkeyClass
 * @param WrappedWallet
 * @return {Function}
 */
const wrapHdkey = (OriginalHdkeyClass, WrappedWallet) => {

	return class WrappedHdkey extends OriginalHdkeyClass{

		constructor(hdKey){
			super(hdKey);
			this._hdkey = hdKey;
		}

		static fromMasterSeed(seedBuffer){
			return new WrappedHdkey(HDKey.fromMasterSeed(seedBuffer));
		}

		static fromExtendedKey(base58Key){
			return new WrappedHdkey(HDKey.fromExtendedKey(base58Key));
		}

		getWallet(){
			if (!this._hdkey._privateKey) {
				throw new Error('private key wasn\'t provided');
			}

			return WrappedWallet.fromPrivateKey(this._hdkey._privateKey);
		}

		derivePath(path){
			return new WrappedHdkey(this._hdkey.derive(path));
		}

		deriveChild(index){
			return new WrappedHdkey(this._hdkey.deriveChild(index));
		}
	};

};

export default wrapHdkey;