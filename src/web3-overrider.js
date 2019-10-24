import { addressToShortMemo } from './utils/address-utils';
import { addHexPrefix } from './utils/converters-utils';
import { inputBlockNumberFormatter } from './utils/block-utils';
import { createJsonRpcRequest } from './utils/json-rpc-utils';
import { toDecimal } from './utils/converters-utils';

export const overrideWeb3CoreMethodsByBridge = (web3Inst, extension) => {

	// inject 'from' field to sendTransaction request created by extension
	const tempSendTx = web3Inst.eth.sendTransaction;
	web3Inst.eth.sendTransaction = (...args) => {
		args[0].from = addHexPrefix(addressToShortMemo(extension.activeAccount));
		return tempSendTx(...args);
	};
};

// NOTE:: web3@0.20.7 hasn't a implimentation of `getLogs` method
export const overrideWeb3EthGetLogs = (web3Inst, provider) => {
	web3Inst.eth.getLogs = (options, cb) => {
		options.toBlock = inputBlockNumberFormatter(options.toBlock);
		options.fromBlock = inputBlockNumberFormatter(options.fromBlock);

		const payload = createJsonRpcRequest('eth_getLogs', [options]);
		provider.sendAsync(payload, (err, jsonRpcResult) => {
			let result;
			if (jsonRpcResult.result) {
				result = jsonRpcResult.result.map((log) => {
					log.blockNumber = log.blockNumber? toDecimal(log.blockNumber): log.blockNumber;
					log.transactionIndex = log.transactionIndex? toDecimal(log.transactionIndex): log.transactionIndex;
					log.logIndex = log.logIndex? toDecimal(log.logIndex): log.logIndex;
					return log;
				});
			}
			cb(err, result);
		});
	};
}; 