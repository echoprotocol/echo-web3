import BridgeMethod from '../../abstract/bridge-method';
import { shortMemoToAddress } from '../../../utils/address-utils';
import { addHexPrefix, cutHexPrefix } from '../../../utils/converters-utils';
import { hashPersonalMessage } from '../../../utils/hash-utils';


class PersonalSignBridge extends BridgeMethod {

	/**
	 * make calculation and api call echo
	 * @return {Promise}
	 */
	async execute() {
		const { message, accountId } = this._formatInput();
		const messageBuffer = Buffer.from(message, 'hex');
		const messageHashBuffer = Buffer.from(hashPersonalMessage(messageBuffer));
		const signature = await this._extension.signData(messageHashBuffer, accountId);
		return this._formatOutput({ signature });
	}

	/**
	 *
	 * @return {{options, operationId}}
	 * @private
	 */
	_formatInput() {
		const [prefixedMessage, ethAddress] = this.params;
		const accountId = shortMemoToAddress(cutHexPrefix(ethAddress));
		const message = cutHexPrefix(prefixedMessage);

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
		return addHexPrefix(signature.toString('hex'));
	}

}

export default PersonalSignBridge;
