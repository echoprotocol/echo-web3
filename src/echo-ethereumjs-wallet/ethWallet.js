import { PrivateKey, hash } from 'echojs-lib';
import { addressToShortMemo } from '../utils/address-utils';

/**
 *
 * @param {Wallet} OriginalEthWallet
 * @param echo
 * @return {*}
 */
const wrapEthWallet = (OriginalEthWallet, echo) => {

	//TODO refactor to class inherits
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
		return Buffer.from(addressToShortMemo(id), 'hex');
	};

	return OriginalEthWallet;
};

export default wrapEthWallet;