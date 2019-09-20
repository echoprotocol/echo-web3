import {addressToShortMemo} from './utils/address-utils';

export const overrideWeb3CoreMethodsByBridge = (web3Inst, extension)=>{

	// inject 'from' field to sendTransaction request created by extension
	const tempSendTx = web3Inst.eth.sendTransaction;
	web3Inst.eth.sendTransaction = (...args) => {
		args[0].from = addressToShortMemo(extension.activeAccount);
		return tempSendTx(...args);
	};
};