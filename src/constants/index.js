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
	'562d693d2fb91f650acb1f95b62b459a7336a2a4de86716d0fd39869331dd42b': 3, // ropsten === testnet
	'db5b719e1c70b4c10b07e8ca56a7b75b4759adbcf90a053855f5cfd0ddedf404': 4, // kovan === devnet
	'958c6999fd8fffff7435709ebfac10be2af677d2398e261ad7de9735089ff5f1': 228 // NOTE:: only for local node

};


export { ECHO_CONSTANTS, ETH_CONSTANTS };
