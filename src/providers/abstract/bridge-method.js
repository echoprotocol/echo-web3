import Method from './method';

/**
 * @abstract
 */
class BridgeMethod extends Method{

	/**
	 *
	 * @param extension
	 * @param params
	 */
	constructor(extension, ...params) {
		super(...params);
		/**
		 * @type {Asset}
		 * */
		this._extension = extension;
	}

	/**
	 *
	 * @return {*}
	 */
	get extension(){
		if(!this._extension) throw new Error('bridge extension object wasn\'t provided');
		return this._extension;
	}

}

export default BridgeMethod;
