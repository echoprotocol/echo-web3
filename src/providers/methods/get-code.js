import Method from '../abstract/method';
import { shortMemoToAddress } from '../../utils/address-utils';
import { addHexPrefix, cutHexPrefix } from '../../utils/converters-utils';

class GetCode extends Method {

	/**
	 * make calculation and api call echo
	 * @return {Promise}
	 */
	async execute() {
		const { contractAddress } = this._formatInput();

		const contract = await this.api.getContract(contractAddress);

		if (!contract) {
			return this._formatOutput('0');
		}

		const [, { code }] = contract;
		return this._formatOutput(code);
	}

	/**
	 *
	 * @return {{contractAddress: string}}
	 * @private
	 */
	_formatInput() {
		const [ethAddress] = this.params;
		const contractAddress = shortMemoToAddress(cutHexPrefix(ethAddress));
		return { contractAddress };
	}

	/**
	 *
	 * @param result
	 * @return {BigNumber}
	 * @private
	 */
	_formatOutput(result) {
		return addHexPrefix(result);
	}

}

export default GetCode;
