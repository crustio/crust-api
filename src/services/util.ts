import { Request } from 'express';
import { ApiPromise } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { SubmittableExtrinsicFunction } from '@polkadot/api/types';

export function loadKeyringPair(api: ApiPromise, req: Request): KeyringPair {
    const [backup, password] = getAccountInfo(req);
    const kr = new Keyring({
        type: 'sr25519'
    });
    
    const krp = kr.addFromJson(JSON.parse(backup));
    krp.decodePkcs8(password);
    return krp; 
}

function getAccountInfo(req: Request): [string, string] {
    // Get and check backup
    const backup = req.body["backup"];
    if (typeof backup !== "string") {
        return ['', ''];
    }
    
    // Get and check password
    const password = req.headers["password"];
    if (typeof password !== "string") {
        return ['', ''];
    }

    return [backup, password];
}