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
    type: 'sr25519',
  });

  const krp = kr.addFromJson(JSON.parse(backup));
  krp.decodePkcs8(password);
  return krp;
}

export function convertToObj(param: any) {
  return JSON.parse(JSON.stringify(param));
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

export async function extrinsicResult(param: AnalysisParam) {
  return new Promise(async (resolve, reject) => {
    const result: CommonRes = {
      action: param.action,
    };
    try {
      await param.tx.signAndSend(param.krp, ({ events = [], status }) => {
        console.log('Transaction status:', status.type);
        if ('Invalid' === status.type) {
          result.status = 'error';
          result.message = 'Transaction status:' + status.type;
          reject(result);
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
                    new Uint8Array([mod.index.toNumber(), mod.error.toNumber()])
                  );
                  message = `${error.section}.${error.name}`;
                  result.status = 'failed';
                  result.message = message;
                  result.details = error.documentation.join('');
                } catch (error) {
                  result.status = 'error';
                  result.message = message;
                }
              }
              resolve(result);
            } else if (method === 'ExtrinsicSuccess') {
              result.status = 'success';
              resolve(result);
            }
          });
        }
      });
    } catch (error) {
      reject(error);
      throw error;
    }
  });
}

export interface AnalysisParam {
  tx: SubmittableExtrinsic;
  api: ApiPromise;
  krp: KeyringPair;
  action: string;
}

export interface CommonRes {
  status?: string;
  action: string;
  message?: string;
  details?: string;
}
