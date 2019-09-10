import { constants } from "echojs-lib";
import { shortMemoToAddress } from './address-utils';
import { weiValueToAssert } from './converters-utils';
import { NATHAN_ID } from '../constants/echo-constants'
import { isValidData } from './validators';

/**
 *
 * @param {EthereumTransaction} ethTx
 * @return {{contractId: string, registrar: string, code: string}}
 */
export const mapEthTxForCall = (ethTx) => {
	if (!ethTx) throw new Error('ethTx is empty');
	const { to, data } = ethTx;
	if (data && !isValidData(data)) throw new Error('invalid "data" field');
	const contractId = shortMemoToAddress(to);
	return { contractId, registrar: NATHAN_ID, code: data.slice(2) };
};

/**
 *
 * @param {EthereumTransaction} ethTx
 * @param {Asset} asset
 * @return {{options, operationId}}
 */
export const mapEthTxToEcho = (ethTx, asset) => {
	// TODO move to ethereumjs-tx class?
	const { from, to, data, value } = ethTx;
	let operationId = null;

	const options = {
		fee: {
			asset_id: asset.id
		},
	};

	const valueWithAssetAccuracyBN = weiValueToAssert(value, asset.precision);
	const valueWithAssetAccuracy = valueWithAssetAccuracyBN.toNumber();

	if (from && to && data) {
		options.callee = shortMemoToAddress(to);
		options.registrar = shortMemoToAddress(from);
		options.code = data;
		options.value = { asset_id: asset.id, amount: valueWithAssetAccuracy };
		operationId = constants.OPERATIONS_IDS.CONTRACT_CALL
	} else if (from && data) {
		options.registrar = shortMemoToAddress(from);
		options.code = data;
		options.value = { asset_id: asset.id, amount: valueWithAssetAccuracy };
		operationId = constants.OPERATIONS_IDS.CONTRACT_CREATE;
		options.eth_accuracy = false;
	} else if (from && to) {
		options.to = shortMemoToAddress(to);
		options.from = shortMemoToAddress(from);
		options.amount = { asset_id: asset.id, amount: valueWithAssetAccuracy };
		operationId = constants.OPERATIONS_IDS.TRANSFER
	}

	return { options, operationId };
};
