import { Market, Account } from 'crust-sdk';
import Endpoint from 'crust-sdk/api/common/Endpoint';
import { StorageOrder } from 'crust-sdk/api/Market';

export default class MarketService {

    market: Market;

    account: Account;

    constructor(endpoint: Endpoint) {
        this.market = new Market(endpoint);
        this.account = new Account(endpoint);
    }

    register = async (backup: string, addressInfo: string, rootPass: string) => {
        try {
            await this.account.keyringLoadAll();
            await this.account.restoreAccount(JSON.parse(backup), rootPass);
            return await this.market.register(addressInfo, JSON.parse(backup)?.address, rootPass)
        } catch (error) {
            await this.account.restoreAccount(JSON.parse(backup), rootPass);
            return await this.market.register(addressInfo, JSON.parse(backup)?.address, rootPass)
        }
    }

    sorder = async (backup: string, storageOrder: StorageOrder, rootPass: string) => {
        try {
            await this.account.keyringLoadAll();
            await this.account.restoreAccount(JSON.parse(backup), rootPass);
            return await this.market.sorder(storageOrder, JSON.parse(backup)?.address, rootPass)
        } catch (error) {
            await this.account.restoreAccount(JSON.parse(backup), rootPass);
            return await this.market.sorder(storageOrder, JSON.parse(backup)?.address, rootPass)
        }
    }

    storageOrders = async (orderId: string) => {
        return await this.market.storageOrders(orderId);
    }

    providers = async (accountId: string) => {
        return await this.market.providers(accountId);
    }

}