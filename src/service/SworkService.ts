import { Swork } from 'crust-sdk';
import Endpoint from 'crust-sdk/api/common/Endpoint';
import { WorkReport } from 'crust-sdk/api/Swork';
import { convertToObj } from 'crust-sdk/util/ConvertUtil';
import { isArray } from 'util';
import BaseService from './BaseService';
export default class sworkService extends BaseService {

    swork: Swork;

    constructor(endpoint: Endpoint) {
        super(endpoint);
        this.swork = new Swork(endpoint);
    }

    identity = async (address: string) => {
        const pubKeys = convertToObj(await this.swork.idBonds(address));
        const result = [];
        if (pubKeys && isArray(pubKeys)) {
            for (const pubKey of pubKeys) {
                result.push([pubKey, convertToObj(await this.swork.identity(pubKey))]);
            }
        }
        return result;
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
        const pubKeys = convertToObj(await this.swork.idBonds(accountId));
        const result = [];
        if (pubKeys && isArray(pubKeys)) {
            for (const pubKey of pubKeys) {
                result.push([pubKey, convertToObj(await this.swork.workReports(pubKey))]);
            }
        }
        return result;
    }

}