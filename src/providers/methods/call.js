import Method from '../abstract/method';
import { addHexPrefix } from '../../utils/converters-utils';
import { mapEthTxForCall } from '../../utils/transaction-utils';

class Call extends Method {

	/**
	 * make calculation and api call echo
	 * @return {Promise}
	 */
	async execute() {
		const { contractId, registrarId, code, amount, assetId } = this._formatInput();
		const asset = { asset_id: assetId, amount };
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
		const { contractId, registrarId, code, amount, assetId } = mapEthTxForCall(ethTx, this.asset);
		return { contractId, registrarId, code, amount, assetId };
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