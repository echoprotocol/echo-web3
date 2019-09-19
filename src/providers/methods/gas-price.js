import Method from './abstract/method';
import { addHexPrefix } from '../../utils/converters-utils';

class GetBalance extends Method {

	/**
	 * make calculation and api call echo
	 * @return {String}
	 */
	execute() {
		return this._formatOutput(20000000000);
	}

	/**
	 *
	 * @param result
	 * @return {String}
	 * @private
	 */
	_formatOutput(result) {
		return addHexPrefix(result.toString(16));
	}

}

export default GetBalance;