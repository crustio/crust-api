import { Swork } from 'crust-sdk';
import Endpoint from 'crust-sdk/api/common/Endpoint';
import { WorkReport } from 'crust-sdk/api/Swork';
import BaseService from './BaseService';
export default class sworkService extends BaseService {

    swork: Swork;

    constructor(endpoint: Endpoint) {
        super(endpoint);
        this.swork = new Swork(endpoint);
    }

    identity = async (address: string) => {
        return await this.swork.identity(address);
    }

    code = async () => {
        return await this.swork.code();
    }

    registerIdentity = async (backup: string, identity: any, rootPass: string) => {
        await this.keyringLoad(backup, rootPass);
        return await this.swork.registerIdentity(JSON.parse(backup)?.address, identity, rootPass)
    }

    reportWorks = async (backup: string, workReport: WorkReport, rootPass: string) => {
        await this.keyringLoad(backup, rootPass);
        return await this.swork.reportWorks(JSON.parse(backup)?.address, workReport, rootPass)
    }

    workReports = async (accountId: string) => {
        return await this.swork.workReports(accountId);
    }

}