import Method from '../abstract/method';
import { addHexPrefix } from '../../utils/converters-utils';
import { mapEthTxForCall } from '../../utils/transaction-utils';

class Call extends Method {

	/**
	 * make calculation and api call echo
	 * @return {Promise}
	 */
	async execute() {
		const { contractId, registrarId, code, amount } = this._formatInput();
		const asset = { asset_id: this.asset.id, amount };
		const rawResult = await this.api.callContractNoChangingState(contractId, registrarId, asset, code);
		return this._formatOutput(rawResult);
	}

	/**
	 *
	 * @return {{contractId: string, registrar: string, code: string}}
	 * @private
	 */
	_formatInput() {
		const [ethTx] = this.params;
		const { contractId, registrarId, code, amount } = mapEthTxForCall(ethTx, this.asset);
		return { contractId, registrarId, code, amount };
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