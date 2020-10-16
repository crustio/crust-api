import { Request, Response } from 'express';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { header } from './block';
import { register } from './swork';
import { loadKeyringPair } from './util';

const api = new ApiPromise({ 
    provider: new WsProvider(process.argv[3] || 'ws://192.168.50.140:9931/'),
    types: {
        Address: 'AccountId',
        AddressInfo: 'Vec<u8>',
        SworkerPubKey: 'Vec<u8>',
        IASSig: 'Vec<u8>',
        ISVBody: 'Vec<u8>',
        SworkerCert: 'Vec<u8>',
        SworkerSignature: 'Vec<u8>',
        SworkerCode: 'Vec<u8>',
        MerkleRoot: 'Vec<u8>',
    }
});

export const block = {
    header: (_: Request, res: Response) => {
        api.isReady.then(async (api) => {
            const h = await header(api);
            res.json({
                number: h.number,
                hash: h.hash
            });
        });
    }
}

export const swork = {
    register: (req: Request, res: Response, next: any) => {
        api.isReady.then(async (api) => {
            try {
                const krp = loadKeyringPair(api, req);
                await register(api, krp, req, res);
            } catch (e) {
                next(e);
            }
        });
    }
}