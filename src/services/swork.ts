<<<<<<< Updated upstream
import {ApiPromise} from '@polkadot/api';
import {Request, Response} from 'express';
import {KeyringPair} from '@polkadot/keyring/types';
=======
import { ApiPromise } from '@polkadot/api';
import { Request, Response } from 'express';
import { KeyringPair } from '@polkadot/keyring/types';
import { DispatchError } from '@polkadot/types/interfaces';
import { ITuple } from '@polkadot/types/types';

interface CommonRes {
    status: any;
    action: any;
    message?: any;
}
>>>>>>> Stashed changes

export async function register(
  api: ApiPromise,
  krp: KeyringPair,
  req: Request,
  res: Response
) {
<<<<<<< Updated upstream
  return await api.tx.swork
    .register(
      req.body['ias_sig'],
      req.body['ias_cert'],
      req.body['account_id'],
      req.body['isv_body'],
      '0x' + req.body['sig']
    )
    .signAndSend(krp, ({events = [], status}) => {
      console.log(`Current status is ${status.type}`);

      // TODO: Extract to util function
      if (status.isFinalized) {
        console.log(`Transaction included at blockHash ${status.asFinalized}`);
        // Loop through Vec<EventRecord> to display all events
        events.forEach(({phase, event: {data, method, section}}) => {
          console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
        });

        res.json({
          status: true,
        });
      }
=======
    return await api.tx.swork.register(
        req.body["ias_sig"],
        req.body["ias_cert"],
        req.body["account_id"],
        req.body["isv_body"],
        "0x" + req.body["sig"]
    ).signAndSend(krp, ({events = [], status}) => {
        console.log(`Current status is ${status.type}`);
        
        // TODO: Extract to util function
        // if (status.isFinalized) {
        //     console.log(`Transaction included at blockHash ${status.asFinalized}`);
        //     // Loop through Vec<EventRecord> to display all events
        //     events.forEach(({ phase, event: { data, method, section } }) => {
        //         console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
        //     });

        //     res.json({
        //         status: true
        //     });
        // }
        
        return new Promise((resolve, _) => {
            let result: CommonRes = {
                status: 'success',
                action: 'register' 
            };
            console.log('Transaction status:', status.type);
            if ('Invalid' === status.type) {
                result.status = 'error';
                result.message = 'Transaction status:' + status.type;
            }
            if (status.isInBlock) {
              events.forEach(({ event: { data, method } }) => {
                if (method === 'ExtrinsicFailed') {
                  const [dispatchError] = (data as unknown) as ITuple<
                    [DispatchError]
                  >;
                  let message = dispatchError.type;
                  if (dispatchError.isModule) {
                    try {
                      const mod = dispatchError.asModule;
                      const error = api.registry.findMetaError(
                        new Uint8Array([
                          mod.index.toNumber(),
                          mod.error.toNumber(),
                        ])
                      );
                      message = `${error.section}.${error.name}`;
    
                    } catch (error) {
    
                    }
                  }
    
                } else if (method === 'ExtrinsicSuccess') {
                    result.status = 'success';
                }
              });
            }
        })
>>>>>>> Stashed changes
    });
}
