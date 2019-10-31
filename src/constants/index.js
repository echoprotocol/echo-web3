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
	'8153276be54891e70c40a2cca91139f6a9074dfd1c21a45b29d9cfc53ec6e0c9': 4, // kovan === devnet
	'3154d577111f1ab5926c2455a2cc767b387a14c1472826e8f8e005ae7ff4e910': 228

};


export { ECHO_CONSTANTS, ETH_CONSTANTS };
