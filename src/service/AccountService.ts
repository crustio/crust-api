import Endpoint from 'crust-sdk/api/common/Endpoint';
import BaseService from './BaseService';

export default class AccountService extends BaseService {
    
    constructor(endpoint: Endpoint) {
        super(endpoint);
    }

    async transfer(backup: string, dest: string, amount: number, rootPass: string) {
        await this.keyringLoad(backup, rootPass);
        return await this.account.transfer(JSON.parse(backup)?.address, dest, amount, rootPass);
    }
    
}