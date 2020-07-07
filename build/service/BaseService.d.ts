import { Account } from 'crust-sdk';
import Endpoint from 'crust-sdk/api/common/Endpoint';
export default class BaseService {
    account: Account;
    constructor(endpoint: Endpoint);
    keyringLoad(backup: string, rootPass: string): Promise<void>;
}
