import BigNumber from 'bignumber.js';
import { ECHO_CONSTANTS, ETH_CONSTANTS } from '../constants';
import { isValidValue } from './validators';

/**
 *
 * @param {String|Number} value
 * @param {Number} assetPrecision
 * @return {BigNumber}
 */
export const assetValueToWei = (value, assetPrecision = ECHO_CONSTANTS.DEFAULT_ASSET_PRECISION) => {
	const precisionDelta = ETH_CONSTANTS.ETH_PRECISION - assetPrecision;
	const multiplier = new BigNumber(10).pow(precisionDelta);
	return (new BigNumber(value)).multipliedBy(multiplier);
};

/**
 *
 * @param {String} value
 * @param {Number} assetPrecision
 * @return {BigNumber}
 */
export const weiValueToAssert = (value, assetPrecision = ECHO_CONSTANTS.DEFAULT_ASSET_PRECISION) => {
	if (typeof value !== 'string') throw new Error('value is not a "string"');
	if (!isValidValue(value)) throw new Error('value is not in hex format');
	const precisionDelta = ETH_CONSTANTS.ETH_PRECISION - assetPrecision;
	const devider = new BigNumber(10).pow(precisionDelta);
	const valueBN = new BigNumber(value.slice(2), 16);
	if(valueBN.eq(0)) return valueBN;
	const valueInAssetSatoshi = valueBN.div(devider);
	if (valueInAssetSatoshi.lt(1)) throw new Error('The precision of pass value is less than minimum asset amount');
	return valueInAssetSatoshi;
};

export const addHexPrefix = (value) => `0x${value}`;