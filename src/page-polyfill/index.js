import BridgeProvider from '../providers/bridge-provider';

const EchoPolyfill = async () => {
	const bridgeProvider = new BridgeProvider();
	await bridgeProvider.init();
    
	window.ethereum = bridgeProvider;
};

export default EchoPolyfill;