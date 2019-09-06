import BigNumber from 'bignumber.js';
import {constants} from 'echojs-lib';
import $c from 'comprehension';

//TODO to constatnts
const CONTRACT_TYPE_ID = constants.OBJECT_TYPES.CONTRACT;
const ACCOUNT_TYPE_ID = constants.OBJECT_TYPES.ACCOUNT;

export const addressRegExp = new RegExp(`^1\\.(${CONTRACT_TYPE_ID}|${ACCOUNT_TYPE_ID})\\.(([1-9]\\d*)|0)$`);

/** @param {string} value */
function checkValue(value) {
	if (typeof value !== 'string') throw new Error('decoding value is not a string');
	if (!/^[\da-fA-F]{64}$/.test(value)) throw new Error('decoding value is not a 32-byte in hex');
}

/**
 * @param {string} value
 * @return {string}
 */
export function decodeAddress(value) {
	checkValue(value);
	if (value.startsWith(''.padStart(24, '0')) && value[24] !== '0') return `0x${value.substr(24)}`;
	if (!value.startsWith(''.padStart(25, '0'))) throw new Error('first 100 bits are not zeros');
	const _13thByte = value.substr(24, 2);
	if (!/^0[01]$/.test(_13thByte)) throw new Error('13th byte is not in ["00", "01"]');
	const isContract = _13thByte === '01';
	const accountIndex = new BigNumber(value.substr(26), 16);
	if (accountIndex.gte('2**32')) return `0x${accountIndex.toString(16).padStart(40, '0')}`;
	return ['1', isContract ? constants.OBJECT_TYPES.CONTRACT : '2', accountIndex.toString(10)].join('.');
}


/**
 * @param {string} address
 * @returns {string}
 */
export function encodeAddress(address){
	if (typeof address !== 'string') throw new Error('address is not a string');
	if (/^0x[a-fA-F\d]{40}$/.test(address)) return address.slice(2).padStart(64, '0');
	if (!addressRegExp.test(address)) throw new Error('invalid address format');
	const [, instanceTypeId, objectId] = address.split('.').map((str) => new BigNumber(str, 10));
	const preRes = objectId.toString(16);
	if (preRes.length > 38) throw new Error('objectId is greater or equals to 2**152');
	const isContract = instanceTypeId.eq(constants.OBJECT_TYPES.CONTRACT);
	return [
		'0',
		isContract ? '1' : '0',
		$c(38 - preRes.length, () => 0).join(''),
		preRes,
	].join('');
}

