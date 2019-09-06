import { PrivateKey, hash } from 'echojs-lib';
import { encodeAddress } from '../utils/address-utils';

/**
 *
 * @param {Wallet} OriginalEthWallet
 * @param echo
 * @return {*}
 */
const wrapEthWallet = (OriginalEthWallet, echo) => {

	/**
	 * register account by created name if it doesn't exist and return private key buffer
	 * @return {Promise<Buffer>}
	 */
	OriginalEthWallet.prototype.getPrivateKey = async function() {
		const echoPrivateKey = PrivateKey.fromBuffer(this._privKey);
		const publicKeyString = echoPrivateKey.toPublicKey().toPublicKeyString();
		const accountName = `ethaccountname${hash.sha256(publicKeyString, 'hex').slice(0, 20)}`;
		const account = await echo.api.getAccountByName(accountName);
		if(!account){
			await echo.api.registerAccount(
				accountName,
				publicKeyString,
				publicKeyString,
			);
		}
		return this._privKey;
	};


	/**
	 *
	 * @return {Promise<Wallet>}
	 */
	OriginalEthWallet.prototype.getAddress = async function() {
		const echoPrivateKey = PrivateKey.fromBuffer(this._privKey);
		const publicKeyString = echoPrivateKey.toPublicKey().toPublicKeyString();
		const accountName = `ethaccountname${hash.sha256(publicKeyString, 'hex').slice(0, 20)}`;
		const account = await echo.api.getAccountByName(accountName);
		if(!account){
			throw new Error('account doesn\'t exist');
		}
		const {id} = account;
		return Buffer.from(encodeAddress(id), 'hex');
	};

	return OriginalEthWallet;
};

export default wrapEthWallet;