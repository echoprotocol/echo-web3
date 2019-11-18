import * as ETH_CONSTANTS from './eth-constants';
import * as ECHO_CONSTANTS from './echo-constants';

export const ECHO_NAME_PREFIX = 'ethaccountname';
export const MIN_WEB3_API_VERSION = '0.20.3';

export const HASH_IDENTIFIERS = {
	TRANSACTION: 1,
	BLOCK: 2
};

export const NETWORK_ID_MAPPING = {
	'': 1, // mainnet
	'3feada346454d1ae76f93dc072e749d727b1b64494df4aa0e42de33496b39711': 3, // ropsten === testnet
	'6cbca6a88f6f5623e51de6a5fd30b2cc89b753f5986f2e3c63e9d466813c5aab': 4, // kovan === devnet
	'958c6999fd8fffff7435709ebfac10be2af677d2398e261ad7de9735089ff5f1': 228 // NOTE:: only for local node

};


export { ECHO_CONSTANTS, ETH_CONSTANTS };
