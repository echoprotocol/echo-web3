
# echo-web3

``echo-web3`` is a wrapper over Web3 that allows you to use web3's instance methods by calling to ECHO blockchain

##Setup

TB;DL

## Basic Usage

Before usage of wrapped web3 methods ECHO-compatible provider(that is exported from ``echo-web3``) should be 
initiated by calling of ``providerInstance.init()`` async method.

```javascript
import Web3 from 'web3';
import EchoWeb3, { EchoProvider } from 'echo-web3';

// 1. wrap your web3 lib. 
// Note: the minimum supported web3 version is 0.2.3 
const WrappedWeb3 = EchoWeb3(Web3);
// 2. define the echo network host
const echoNetwork = 'wss://testnet.echo-dev.io/ws';

(async () => {

	//1. 
	const echoProvider = new EchoProvider(echoNetwork, { assetId: '1.3.0' });
	const web3 = new WrappedWeb3(echoProvider);
	await echoProvider.init(); // create connection to echo node

	web3.eth.getBalance('0x00000000000000000000000000000000000001A9', (err, res)=>{
		console.log(res);   // BigNumber { s: 1, e: 19, c: [ 500000 ] } (50 ECHO in wei)
		web3.disconnect();
	});

})();
```

### List of implemented methods

Async request (use as method with callback)
* [call](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_call)
* getBlock *([only by number](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getblockbynumber))*
* [getBalance](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getbalance)
* [sendRawTransaction](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sendrawtransaction)
* [getBlockNumber](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_blocknumber) 
* [getTransactionCount](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gettransactioncount)
* [GetTransactionReceipt](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gettransactionreceipt)
* [GetCode](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getcode)
* [GetLogs](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getlogs) *(works only with the fixed web3 version [link](https://github.com/toffick/web3.js/tree/fix-inputGetLogsFormatter-return-value))*

Sync request (use as property)
* gasPrice 

## Ehtereumjs-wallet

For backward compatibility with the [Ethereumjs-wallet](https://github.com/ethereumjs/ethereumjs-wallet) 

TB;DL

## Ehtereumjs-tx

For backward compatibility with the [Ethereumjs-tx](https://github.com/ethereumjs/ethereumjs-tx) 
was designed class `EthereumjsTx` that received a ECHO instance when is created by `EchoWeb3Instance`: 

```javascript
(async () => {
	const template = {
		to: "0x010000000000000000000000000000000000014d",
		data: "0x095ea7b30000000000000000000000000100000000000000000000000000000000000155000000000000000000000000000000000000000000000000002386f26fc10000",
		from: "0x0000000000000000000000000000000000000189",
		value: '0x0',
	} // contract call
    		
	const transaction = wrappedWeb3Instance.createEthereumTransaction(template); //pass the etehreum transaction object
	await transaction.sign(privateKey);  //signing is required before getting of raw tx
	const rawTx = transaction.serialize()  // getting of raw tx buffer
	console.log(rawTx.toString('hex'));
	
	// a3b9c4eac9e93a6d775d0119f5000000000000000089030000000000000000008a01307830393565613762333030303030
	// 3030303030303030303030303030303030303030313030303030303030303030303030303030303030303030303030303
	// 0303030303030303135353030303030303030303030303030303030303030303030303030303030303030303030303030
	// 3030303030303030303030303233383666323666633130303030cd02000001eb4f9055faeb3d65362eb2fe1611203cb35
	// aa09b9f4bd7cae52c631109e1087d0196850e689646552c5fda3007e5d27c513938dee872e6d3c2bbc678b9b6a20e
	
})()
```

## License

The MIT License (MIT)

Copyright (c) 2019 Echo Technological Solutions LLC

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.