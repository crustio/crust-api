import { Tee } from 'crust-sdk';
import Endpoint from 'crust-sdk/api/common/Endpoint';
import BaseService from './BaseService';
export default class TeeService extends BaseService {

    tee: Tee;

    constructor(endpoint: Endpoint) {
        super(endpoint);
        this.tee = new Tee(endpoint);
    }

    identity = async (address: string) => {
        return await this.tee.identity(address);
    }

    registerIdentity = async (backup: string, identity: any, rootPass: string) => {
        await this.keyringLoad(backup, rootPass);
        return await this.tee.registerIdentity(JSON.parse(backup)?.address, identity, rootPass)
    }

    reportWorks = async (backup: string, workReport: any, rootPass: string) => {
        await this.keyringLoad(backup, rootPass);
        return await this.tee.reportWorks(JSON.parse(backup)?.address, workReport, rootPass)
    }

    workReports = async (accountId: string) => {
        return await this.tee.workReports(accountId);
    }

}