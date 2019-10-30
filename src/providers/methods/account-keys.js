import Method from './abstract/method';
import { shortMemoToAddress } from '../../utils/address-utils';
import { isValidAddress } from '../../utils/validators';
import { decode } from 'bs58';

//TODO:: add docs
class AccountKeys extends Method {

	/**
	 * make calculation and api call echo
	 * @return {Promise}
	 */
	async execute() {
		const { accountId } = this._formatInput();

		const [fullAccount] = await this.api.getFullAccounts([accountId]);
        
		if(!fullAccount){
			throw new Error('unknown account');
		}

		//TODO:: add search auth keys recursively by general accounts
		const { active: { key_auths: keyAuths } } = fullAccount;
		const publicKeys = keyAuths.map((keyAuth) => {
			const [prefixedPublicKey] = keyAuth;
			const publicKey = decode(prefixedPublicKey.slice(4));
			return publicKey.toString('hex');
		});

		return publicKeys;
	}

	/**
	 *
	 * @return {{contractId: string, registrar: string, code: string}}
	 * @private
	 */
	_formatInput() {
		const [ethAddress] = this.params;
		if (!isValidAddress(ethAddress)) throw new Error('invalid address');
		const accountId = shortMemoToAddress(ethAddress);

		return { accountId };
	}

}

export default AccountKeys;