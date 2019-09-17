import toHex from 'to-hex';
import Method from './method';
import { shortMemoToAddress } from '../../../utils/address-utils';
import { addHexPrefix } from '../../../utils/converters-utils';
import { ETH_CONSTANTS } from '../../../constants';

class SendRawTransaction extends Method {

	/**
	 * make calculation and api call echo
	 * @return {Promise}
	 */
	async execute() {

	}

	/**
	 *
	 * @return {{accountId: string}}
	 * @private
	 */
	_formatInput() {
	}

	/**
	 *
	 * @param result
	 * @return {String}
	 * @private
	 */
	_formatOutput(result) {

	}

}

export default SendRawTransaction;