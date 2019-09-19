import Method from './abstract/method';

class BlockNumber extends Method {

	/**
	 * make calculation and api call echo
	 * @return {Promise}
	 */
	async execute() {
		const dynamicGlobalProperties = await this.api.getDynamicGlobalProperties();
		if(!dynamicGlobalProperties){
			return this._formatOutput(0);
		}
		const {head_block_number: blockNum} = dynamicGlobalProperties;
		return this._formatOutput(blockNum);
	}


}

export default BlockNumber;