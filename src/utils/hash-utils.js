import createKeccakHash from 'keccak';

/**
 * @description returns the keccak hash of prefixed message 
 * according with `eth_sign` classic implementation
 * @param {Buffer} message 
 */
export const hashPersonalMessage = function (message) {
	const prefix = Buffer.from(
		`\u0019Ethereum Signed Message:\n${message.length.toString()}`,
		'utf-8',
	);
    
	return createKeccakHash('keccak256')
		.update(Buffer.concat([prefix, message]))
		.digest();

};