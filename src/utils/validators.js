/**
 *
 * @param {String} ethAddress
 * @return {boolean}
 */
export const isValidAddress = (ethAddress) =>{
	return /^0x[a-fA-F\d]{40}$/.test(ethAddress);
};

/**
 *
 * @param {String} data
 * @return {boolean}
 */
export const isValidData = (data) =>{
	return /^0x[a-zA-Z\d]+$/.test(data);
};

/**
 *
 * @param {String} txHash
 * @return {boolean}
 */
export const isValidIdentificationHash = (txHash) =>{
	return /^0x[a-zA-Z\d]{64}$/.test(txHash);
};

/**
 *
 * @param {String} value
 * @return {boolean}
 */
export const isValidValue = (value) =>{
	return /^0x[a-zA-Z\d]+$/.test(value);
};
