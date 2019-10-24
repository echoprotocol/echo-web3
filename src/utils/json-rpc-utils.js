let id = 0;
const _getNextId = ()=> id++;

/**
	 *
	 * @param {id: Number|String} payload
	 * @param {*} result
	 * @param {*?} error
	 * @return {*}
	 */
export const createJsonRpcResponse = (id, result, error) => {
	return {
		id,
		jsonrpc: '2.0',
		...error ? { error } : { result }
	};
};

/**
 * 
 * @param {*} method 
 * @param {*} params 
 */
export const createJsonRpcRequest = (method, params)=>{
	return {
		jsonrpc: '2.0',
		id: _getNextId(),
		method,
		params
	};
};