import { Account } from 'crust-sdk'
import Endpoint from 'crust-sdk/api/common/Endpoint';

export default class BaseService {
    
    account: Account

    constructor(endpoint: Endpoint) {
        this.account = new Account(endpoint);
    }

    async keyringLoad(backup: string, rootPass: string) {
        try {
            await this.account.keyringLoadAll();
            await this.account.restoreAccount(JSON.parse(backup), rootPass);
        } catch (error) {
            console.log('keyring has being loaded ...');
            await this.account.restoreAccount(JSON.parse(backup), rootPass);
        }
    }
    
}