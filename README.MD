
# echo-web3

echo-web3 is a wrapper over Web3 that allow you to use web3's instance methods with the saving of methods signatures by calling to ECHO blockchain

## Usage

```javascript
import Web3 from 'web3';
import EchoWeb3 from '../dist';

const EchoProvider = EchoWeb3.echoProvider;
const WrappedWeb3 = EchoWeb3(Web3)
const echoNetwork = 'wss://testnet.echo-dev.io/ws';

(async () => {
	const echoProvider = new EchoProvider(echoNetwork, { assetId: '1.3.0' });
	const wrappedWeb3Instance = new WrappedWeb3(echoProvider);
	await echoProvider.init() // create connection to echo node

	const balance = await wrappedWeb3Instance.eth.getBalance('0x010000000000000000000000000000000000014d');
	// balance = 1000000000000
})()
```

## License

The MIT License (MIT)

Copyright (c) 2019 Echo Technological Solutions LLC

Copyright (c) 2014, 2015, 2019 the individual contributors


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