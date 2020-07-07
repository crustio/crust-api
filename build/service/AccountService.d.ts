import Endpoint from 'crust-sdk/api/common/Endpoint';
import BaseService from './BaseService';
export default class AccountService extends BaseService {
    constructor(endpoint: Endpoint);
    transfer(backup: string, dest: string, amount: number, rootPass: string): Promise<Partial<import("crust-sdk/api/Account").ActionStatus>>;
}
