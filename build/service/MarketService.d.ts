import { Market } from 'crust-sdk';
import Endpoint from 'crust-sdk/api/common/Endpoint';
import { StorageOrder } from 'crust-sdk/api/Market';
import BaseService from './BaseService';
export default class MarketService extends BaseService {
    market: Market;
    constructor(endpoint: Endpoint);
    register: (backup: string, addressInfo: string, storagePrice: number, rootPass: string) => Promise<Partial<import("crust-sdk/api/Account").ActionStatus>>;
    sorder: (backup: string, storageOrder: StorageOrder, rootPass: string) => Promise<Partial<import("crust-sdk/api/Account").ActionStatus>>;
    storageOrders: (orderId: string) => Promise<import("@polkadot/types/types").Codec>;
    providers: (accountId: string) => Promise<import("@polkadot/types/types").Codec>;
}
