import {ApiPromise} from '@polkadot/api';
import {Request, Response} from 'express';
import {KeyringPair} from '@polkadot/keyring/types';

export async function register(
  api: ApiPromise,
  krp: KeyringPair,
  req: Request,
  res: Response
) {
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
    });
}
