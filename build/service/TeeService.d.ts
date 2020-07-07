import { Tee } from 'crust-sdk';
import Endpoint from 'crust-sdk/api/common/Endpoint';
import BaseService from './BaseService';
export default class TeeService extends BaseService {
    tee: Tee;
    constructor(endpoint: Endpoint);
    identity: (address: string) => Promise<import("@polkadot/types/types").Codec>;
    registerIdentity: (backup: string, identity: any, rootPass: string) => Promise<Partial<import("crust-sdk/api/Account").ActionStatus>>;
    reportWorks: (backup: string, workReport: any, rootPass: string) => Promise<Partial<import("crust-sdk/api/Account").ActionStatus>>;
    workReports: (accountId: string) => Promise<import("@polkadot/types/types").Codec>;
}
