
# echo-web3

``echo-web3`` is a wrapper over Web3 that allows you to use web3's instance methods by calling to ECHO blockchain

## Setup

TB;DL

## Basic Usage

Before usage of wrapped web3 methods ECHO-compatible provider(that is exported from `echo-web3`) should be 
initiated by calling of `providerInstance.init()` async method.

###### Example:

```javascript
import Web3 from 'web3';
import EchoWeb3, { EchoProvider } from 'echo-web3';

// 1. wrap your web3 lib
// Note: the minimum supported web3 version is 0.2.3 
const WrappedWeb3 = EchoWeb3(Web3);

// 2. define the echo network host
const echoNetwork = 'wss://testnet.echo-dev.io/ws';

(async () => {

	//3. create echoProvider instance. Default asset is 1.3.0
	const echoProvider = new EchoProvider(echoNetwork, { assetId: '1.3.0' });
	
	//4. pass the provider in web3 instance
	const web3 = new WrappedWeb3(echoProvider);
	
	//5. init provider
	await echoProvider.init();

	web3.eth.getBalance('0x00000000000000000000000000000000000001A9', (err, res)=>{
		console.log(res);   // BigNumber { s: 1, e: 19, c: [ 500000 ] } (50 ECHO in wei)
		//6. disconnect from echo network
		web3.disconnect();
	});

})();
```

### List of implemented methods and properties

All of this implemented methods can be executed by calling:
 > `web3Instance.eth.<methodName>(param1, param2, callback)`.

All async methods receive payload parameters like in original Web3 JSON-RPC and the callback as last parameter.
The signature of callback is: 
 > `(error, result)=>{}`.

Async request (use as method with callback):
* [call](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_call)
* getBlock *([only by number](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getblockbynumber))*
* [getBalance](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getbalance)
* [sendRawTransaction](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sendrawtransaction)
* [getBlockNumber](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_blocknumber) 
* [getTransactionCount](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gettransactioncount)
* [GetTransactionReceipt](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gettransactionreceipt)
* [GetCode](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getcode)
* [GetLogs](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getlogs) *(works only with the fixed web3 version [link](https://github.com/toffick/web3.js/tree/fix-inputGetLogsFormatter-return-value))*

Sync request (use as property):
* [gasPrice](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gasprice) 

## Bridge extension
Like the MetaMask that inject web3 instance on page, there was designed `BridgeProvider` that helps you to
work with echo-web3 instance on frontend pages with [Bridge extension](https://github.com/echoprotocol/bridge-extension).

###### Example:

```javascript
import Web3 from 'web3';
import EchoWeb3, { BridgeProvider } from 'echo-web3';

// 1. wrap your web3 lib
// Note: the minimum supported web3 version is 0.2.3
const WrappedWeb3 = EchoWeb3(Web3);

(async () => {

	//2. create bridgeProvider instance. Default asset is 1.3.0
	const bridgeProvider = new BridgeProvider({ assetId: '1.3.0' });

	//3. pass the provider in web3 instance
	const web3 = new WrappedWeb3(bridgeProvider);

	//3. init provider
	await bridgeProvider.init();
	
	//4. get access to extension from your page
	await web3.currentProvider.enable();

	console.log(web3.eth.accounts); // ["0x000000000000000000000000000000000000013a"]
	
	web3.eth.sendTransaction({
		to: '0x00000000000000000000000000000000000001e9',  // 1.2.489
		value: '500000000000000000'                        // 0.5 ECHO
	}, (err, res)=>{
		console.log(res);                                  // <txHash>
		web3.disconnect();
	});

})();
```
Before calling web3 method's you should give your page access to bridge extension by calling of
`web3.currentProvider.enable()`. 

### List of implemented methods

See description of method usage above.

Async request (use as method with callback):
* [sendTransaction](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sendtransaction)
* [call](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_call)
* getBlock *([only by number](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getblockbynumber))*
* [getBalance](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getbalance)
* [sendRawTransaction](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sendrawtransaction)
* [getBlockNumber](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_blocknumber) 
* [getTransactionCount](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gettransactioncount)
* [getTransactionReceipt](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gettransactionreceipt)
* [getCode](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getcode)
* [getLogs](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getlogs) *(works only with the fixed web3 version [link](https://github.com/toffick/web3.js/tree/fix-inputGetLogsFormatter-return-value))*
* [getNetwork](https://github.com/ethereum/wiki/wiki/JSON-RPC#net_version)

Sync request (use as property):
* [gasPrice](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gasprice) 
* [accounts](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_accounts) 


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