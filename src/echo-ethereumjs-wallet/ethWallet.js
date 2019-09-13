import { PrivateKey, hash } from 'echojs-lib';
import { addressToShortMemo } from '../utils/address-utils';
import { ECHO_NAME_PREFIX } from '../constants';

/**
 *
 * @param {Wallet} OriginalEthWallet
 * @param echo
 * @return {*}
 */
const wrapEthWallet = (OriginalEthWallet, echo) => {

	return class WrapEthWallet extends OriginalEthWallet {

		static fromPrivateKey(privateKey){
			return new WrapEthWallet(privateKey);
		}

		/**
		 * register account by created name if it doesn't exist and return private key buffer
		 * @return {Promise<Buffer>}
		 */
		async getPrivateKey() {
			const echoPrivateKey = PrivateKey.fromBuffer(this._privKey);
			const publicKeyString = echoPrivateKey.toPublicKey().toPublicKeyString();
			const accountName = `${ECHO_NAME_PREFIX}${hash.sha256(publicKeyString, 'hex').slice(0, 20)}`;
			const account = await echo.api.getAccountByName(accountName);
			if(!account){
				await echo.api.registerAccount(
					accountName,
					publicKeyString,
					publicKeyString,
				);
			}
			return this._privKey;
		}

		/**
		 *
		 * @return {Promise<Buffer>}
		 */
		async getAddress() {
			const echoPrivateKey = PrivateKey.fromBuffer(this._privKey);
			const publicKeyString = echoPrivateKey.toPublicKey().toPublicKeyString();
			const accountName = `${ECHO_NAME_PREFIX}${hash.sha256(publicKeyString, 'hex').slice(0, 20)}`;
			const account = await echo.api.getAccountByName(accountName);
			if(!account){
				throw new Error('account doesn\'t exist');
			}
			const {id} = account;
			return Buffer.from(addressToShortMemo(id), 'hex');
		}
	};

};

export default wrapEthWallet;