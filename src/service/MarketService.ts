import { Market, Account } from 'crust-sdk';
import Endpoint from 'crust-sdk/api/common/Endpoint';
import { StorageOrder } from 'crust-sdk/api/Market';
import BaseService from './BaseService';

export default class MarketService extends BaseService {

    market: Market;

    constructor(endpoint: Endpoint) {
        super(endpoint);
        this.market = new Market(endpoint);
    }

    register = async (backup: string, addressInfo: string,storagePrice: number, rootPass: string) => {
        await this.keyringLoad(backup, rootPass);
        return await this.market.register(addressInfo, storagePrice, JSON.parse(backup)?.address, rootPass)
    }

    sorder = async (backup: string, storageOrder: StorageOrder, rootPass: string) => {
        await this.keyringLoad(backup, rootPass);
        return await this.market.sorder(storageOrder, JSON.parse(backup)?.address, rootPass)
    }

    storageOrders = async (orderId: string) => {
        return await this.market.storageOrders(orderId);
    }

    merchants = async (accountId: string) => {
        return await this.market.merchants(accountId);
    }

}