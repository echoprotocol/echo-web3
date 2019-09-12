import BigNumber from 'bignumber.js';
import { ECHO_CONSTANTS, ETH_CONSTANTS } from '../constants';

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
 * @param {String|Number} value
 * @param {Number} assetPrecision
 * @return {BigNumber}
 */
export const weiValueToAssert = (value, assetPrecision = ECHO_CONSTANTS.DEFAULT_ASSET_PRECISION) => {
	const precisionDelta = ETH_CONSTANTS.ETH_PRECISION - assetPrecision;
	const devider = new BigNumber(10).pow(precisionDelta);
	const valueBN = typeof value === 'string'? new BigNumber(value.slice(2), 16) : new BigNumber(value, 10);
	if (valueBN.eq(0)) return valueBN;
	const valueInAssetSatoshi = valueBN.div(devider);
	if (valueInAssetSatoshi.lt(1)) throw new Error('The precision of pass value is less than minimum asset amount');
	return valueInAssetSatoshi;
};

export const addHexPrefix = (value) => value? `0x${value}`: '0x';
export const toBigNumber = (value) => {
	if (typeof value === 'string' && (value.indexOf('0x') === 0 || value.indexOf('-0x') === 0)) {
		return new BigNumber(value.replace('0x', ''), 16);
	}

	return new BigNumber(value.toString(10), 10).toNumber();
};

export const toDecimal = (value) => toBigNumber(value).toNumber();