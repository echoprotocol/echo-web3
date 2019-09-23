import BigNumber from 'bignumber.js';
import { constants, hash } from 'echojs-lib';

import {addHexPrefix} from '../utils/converters-utils';
import { isValidAddress } from './validators';
import { ECHO_NAME_PREFIX } from '../constants';

/**
 *
 * @param {String} publicKey
 * @return {string}
 */
export const generateAccountNameByPublicKey = (publicKey) =>`${ECHO_NAME_PREFIX}${hash.sha256(publicKey, 'hex').slice(0, 20)}`;
export const addressRegExp = new RegExp(`^1\\.(${constants.OBJECT_TYPES.CONTRACT}|${constants.OBJECT_TYPES.ACCOUNT})\\.(([1-9]\\d*)|0)$`);

/**
 * @param {string} value
 * @return {string|null}
 */
export function shortMemoToAddress(value) {
	if(!value) return null;
	if(value.substr(0,2)==='0x') value = value.slice(2);
	if (typeof value !== 'string') throw new Error('decoding value is not a string');
	if (value.startsWith(''.padStart(24, '0')) && value[24] !== '0') return addHexPrefix(value.substr(24));
	if (!value.startsWith(''.padStart(1, '0'))) throw new Error('first 100 bits are not zeros');
	const _1stByte = value.substr(0, 2);
	if (!/^0[01]$/.test(_1stByte)) throw new Error('13th byte is not in ["00", "01"]');
	const isContract = _1stByte === '01';
	const accountIndex = new BigNumber(value.substr(26), 16);
	if (accountIndex.gte('2**32')) return `0x${accountIndex.toString(16).padStart(40, '0')}`;
	return ['1', isContract ? constants.OBJECT_TYPES.CONTRACT : '2', accountIndex.toString(10)].join('.');
}


/**
 * @description https://dev.echo.org/developers/smart-contracts/solidity/introduction/ convert account id to ETH represent address
 * @param {string} address
 * @returns {string}
 */
export function addressToShortMemo(address) {
	if (typeof address !== 'string') throw new Error('address is not a string');
	if (isValidAddress(address)) return address.slice(2).padStart(64, '0');
	if (!addressRegExp.test(address)) throw new Error('invalid address format');
	const [, instanceTypeId, objectId] = address.split('.').map((str) => new BigNumber(str, 10));
	const preRes = objectId.toString(16);
	if (preRes.length > 38) throw new Error('objectId is greater or equals to 2**152');
	const isContract = instanceTypeId.eq(constants.OBJECT_TYPES.CONTRACT);
	return [
		'0',
		isContract ? '1' : '0',
		new Array(38 - preRes.length).fill(0).map(() => 0).join(''),
		preRes,
	].join('');
}
