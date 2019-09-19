import toHex from 'to-hex';
import Method from './abstract/method';
import { shortMemoToAddress } from '../../utils/address-utils';
import { addHexPrefix } from '../../utils/converters-utils';

class GetTransactionCount extends Method {

	/**
	 * make calculation and api call echo
	 * @return {Promise}
	 */
	async execute() {
		const { accountId } = this._formatInput();

		const account = await this.api.getObject(accountId);

		if (!account) {
			return this._formatOutput(0);
		}

		const {total_ops: totalOperations} = await this.api.getObject(account.statistics);

		return this._formatOutput(totalOperations);
	}

	/**
	 *
	 * @return {{accountId: string}}
	 * @private
	 */
	_formatInput() {
		const [ethAddress] = this.params;
		const accountId = shortMemoToAddress(ethAddress.slice(2));
		return { accountId };
	}

	/**
	 *
	 * @param result
	 * @return {String}
	 * @private
	 */
	_formatOutput(result) {
		return addHexPrefix(toHex(result));
	}

}

export default GetTransactionCount;