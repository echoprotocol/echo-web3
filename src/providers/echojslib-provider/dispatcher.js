import { decodeAddress } from '../../utils/address-utils';

class Dispatcher {

	constructor(echoInstance) {
		this._echo = echoInstance;
	}

	resolveMethod(method) {
		switch(method){
			case 'eth_getBalance': return this._getBalance.bind(this);
			default: return null;
		}
	}

	async _getBalance(params) {
		const [ethAddress] = params;

		const accountId = decodeAddress(ethAddress);

		this.echo.getFullAccounts([accountId])
			.then((results) => {
				if (!results || !results[0]) {
					return cb('Unknown account id');
				}

				const {balances} = results[0];
				const balancesArray = Object.keys(balances).map((assetType) => ({assetType, objectId: balances[assetType]}));

				if (!balancesArray.length) {
					return cb(null, [{
						precision: 8,
						symbol: 'ECHO',
						amount: '0',
						assetType: '1.3.0'
					}]);
				}

				Promise.all(balancesArray.map((balanceObject) => {
					return new Promise((resolve) => {
						this.echo.getObject(balanceObject.objectId)
							.then((result) => ({
								amount: result.balance,
								assetType: balanceObject.assetType
							}))
							.then((result) => {
								this.echo.getObject(result.assetType)
									.then((assetResult) => resolve({
										...result,
										symbol: assetResult.symbol,
										precision: assetResult.precision
									}));
							})
							.catch(() => resolve({
								amount: null,
								assetType: balanceObject.assetType
							}));
					});
				}))
					.then((result) => {
						return cb(null, result);
					});
			});
	}

}

export default Dispatcher;
