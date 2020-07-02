import { Tee, Account } from 'crust-sdk';
import Endpoint from 'crust-sdk/api/common/Endpoint';

export default class TeeService {

    tee: Tee;

    account: Account;

    constructor(endpoint: Endpoint) {
        this.tee = new Tee(endpoint);
        this.account = new Account(endpoint);
    }

    identity = async (address: string) => {
        return await this.tee.identity(address);
    }

    registerIdentity = async (backup: string, identity: any, rootPass: string) => {
        try {
            await this.account.keyringLoadAll();
            await this.account.restoreAccount(JSON.parse(backup), rootPass);
            console.log('registerIdentity identity: ', identity)
            return await this.tee.registerIdentity(JSON.parse(backup)?.address, identity, rootPass)
        } catch (error) {
            await this.account.restoreAccount(JSON.parse(backup), rootPass);
            console.log('registerIdentity identity: ', identity)
            return await this.tee.registerIdentity(JSON.parse(backup)?.address, identity, rootPass)
        }
    }

    reportWorks = async (backup: string, workReport: any, rootPass: string) => {
        try {
            await this.account.keyringLoadAll();
            await this.account.restoreAccount(JSON.parse(backup), rootPass);
            return await this.tee.reportWorks(JSON.parse(backup)?.address, workReport, rootPass)
        } catch (error) {
            await this.account.restoreAccount(JSON.parse(backup), rootPass);
            return await this.tee.reportWorks(JSON.parse(backup)?.address, workReport, rootPass)
        }

    }

    workReports = async (accountId: string) => {
        return await this.tee.workReports(accountId);
    }

}