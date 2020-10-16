import { Request } from 'express';
import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { ApiPromise } from '@polkadot/api';
import { DispatchError } from '@polkadot/types/interfaces';
import { ITuple } from '@polkadot/types/types';

export function loadKeyringPair(req: Request): KeyringPair {
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
  const backup = req.body['backup'];
  if (typeof backup !== 'string') {
    return ['', ''];
  }

  // Get and check password
  const password = req.headers['password'];
  if (typeof password !== 'string') {
    return ['', ''];
  }

    return [backup, password];
}

async function analyzeTxResults() {
    return await analysisTxEvents(param);
}

function analysisTxEvents(param: AnalysisPram): Promise<string> {
    let result: CommonRes = {
        status: 'success',
        action: param.action
    };
    return new Promise(async (resolve, _) => {
        await param.submittableExtrinsic.signAndSend(param.krp,
          ({ events = [], status }) => {
            console.log('Transaction status:', status.type);
            if ('Invalid' === status.type) {
                result.status.status = 'error';
                result.status.message = 'Transaction status:' + status.type;
              resolve('failed');
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
                      const error = param.api.registry.findMetaError(
                        new Uint8Array([
                          mod.index.toNumber(),
                          mod.error.toNumber(),
                        ])
                      );
                      message = `${error.section}.${error.name}`;
                      result.status.status = 'failed';
                      result.status.message = message;
                      result.status.details = error.documentation.join('');
                    } catch (error) {
                        result.status.status = 'error';
                        result.status.message = message;
                    }
                  }
                  resolve(message);
                } else if (method === 'ExtrinsicSuccess') {
                    result.status.status = 'success';
                  resolve('success');
                }
              });
            }
          }
        );
      });
}

interface AnalysisPram {
    submittableExtrinsic: SubmittableExtrinsic;
    api: ApiPromise, 
    krp: KeyringPair,
    action: string
}

interface CommonRes {
    status: any;
    action: any;
    message?: any;
}
