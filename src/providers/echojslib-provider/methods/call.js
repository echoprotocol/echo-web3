import Method from './method';
import { addHexPrefix } from '../../../utils/converters-utils';
import { mapEthTxForCall } from '../../../utils/transaction-utils';

class Call extends Method {

	/**
	 * make calculation and api call echo
	 * @return {Promise}
	 */
	async execute() {
		const {contractId, registrar, code} = this._formatInput();
		const rawResult = await this.api.callContractNoChangingState(contractId, registrar, this.asset.id, code);
		return this._formatOutput(rawResult);
	}

	/**
	 *
	 * @return {{contractId: string, registrar: string, code: string}}
	 * @private
	 */
	_formatInput() {
		const [ethTx] = this.params;
		const {contractId, registrar, code} = mapEthTxForCall(ethTx);
		return {contractId, registrar, code};
	}

	/**
	 *
	 * @param result
	 * @return {String}
	 * @private
	 */
	_formatOutput(result) {
		return addHexPrefix(result);
	}

}

export default Call;