import BridgeMethod from '../../abstract/bridge-method';
import { shortMemoToAddress } from '../../../utils/address-utils';
import { addHexPrefix, cutHexPrefix } from '../../../utils/converters-utils';


class SignBridge extends BridgeMethod {

	/**
	 * make calculation and api call echo
	 * @return {Promise}
	 */
	async execute() {
		const { message, accountId } = this._formatInput();
		const messageBuffer = Buffer.from(message, 'hex');
		const signature = await this._extension.signData(messageBuffer, accountId);
		return this._formatOutput({ signature });
	}

	/**
	 *
	 * @return {{options, operationId}}
	 * @private
	 */
	_formatInput() {
		const [ethAddress, prefixedMessageHex] = this.params;
		const accountId = shortMemoToAddress(cutHexPrefix(ethAddress));
		const message = cutHexPrefix(prefixedMessageHex);

		return { message, accountId };
	}

	/**
	 *
	 * @param result
	 * @return {String}
	 * @private
	 */
	_formatOutput(result) {
		const { signature } = result;

		// TODO rm after release bridge@1.14.0
		let stringSignarute = signature.toString('hex');
		if (stringSignarute.length === 256){
			stringSignarute = stringSignarute.slice(0, 128);
		}
		return addHexPrefix(stringSignarute);
	}

}

export default SignBridge;
