import BigNumber from 'bignumber.js';
import { ECHO_CONSTANTS, ETH_CONSTANTS } from '../constants';

/**
 *
 * @param value
 * @param assetPrecision
 * @return {BigNumber}
 */
export const assetValueToWei = (value, assetPrecision = ECHO_CONSTANTS.DEFAULT_ASSET_PRECISION) => {
	const precisionDelta = ETH_CONSTANTS.ETH_PRECISION - assetPrecision;
	return new BigNumber(value).multipliedBy(10 ** precisionDelta);
};
