import BridgeMethod from '../../abstract/bridge-method';
import { addHexPrefix } from '../../../utils/converters-utils';
import { addressToShortMemo } from '../../../utils/address-utils';

class AccountsSyncBridge extends BridgeMethod {

	/**
	 * make calculation and api call echo
	 * @return {[String]}
	 */
	execute() {
		return this._formatOutput(this.extension.activeAccount);
	}

	/**
	 *
	 * @param result
	 * @return {[String]}
	 * @private
	 */
	_formatOutput(result) {
		if(!result) return [];
		return [addHexPrefix(addressToShortMemo(result))];
	}

}

export default AccountsSyncBridge;