import {Request} from 'express';
import {Keyring} from '@polkadot/keyring';
import {KeyringPair} from '@polkadot/keyring/types';
import {DispatchError} from '@polkadot/types/interfaces';
import {ITuple} from '@polkadot/types/types';
import {SubmittableExtrinsic} from '@polkadot/api/promise/types';
import {TxRes, api} from './index';

/**
 * Public functions
 */
export function loadKeyringPair(req: Request): KeyringPair {
  const [backup, password] = getAccountInfo(req);
  const kr = new Keyring({
    type: 'sr25519',
  });

  const krp = kr.addFromJson(JSON.parse(backup));
  krp.decodePkcs8(password);
  return krp;
}

export async function sendTx(tx: SubmittableExtrinsic, krp: KeyringPair) {
  return new Promise((resolve, reject) => {
    try {
      tx.signAndSend(krp, ({events = [], status}) => {
        console.log('💸 Transaction status:', status.type);

        if ('Invalid' === status.type) {
          reject(new Error('Invalid transaction.'));
        }
        if (status.isInBlock) {
          events.forEach(({event: {data, method, section}}) => {
            if (section === 'system' && method === 'ExtrinsicFailed') {
              const [dispatchError] = (data as unknown) as ITuple<
                [DispatchError]
              >;
              const result: TxRes = {
                status: 'failed',
                message: dispatchError.type,
              };
              // Can get detail error info
              if (dispatchError.isModule) {
                const mod = dispatchError.asModule;
                const error = api.registry.findMetaError(
                  new Uint8Array([mod.index.toNumber(), mod.error.toNumber()])
                );
                result.message = `${error.section}.${error.name}`;
                result.details = error.documentation.join('');
              }

              console.log(
                `❌ Send transaction(${tx.type}) failed with ${result.message}.`
              );
              resolve(result);
            } else if (method === 'ExtrinsicSuccess') {
              const result: TxRes = {
                status: 'success',
              };

              console.log(`✅ Send transaction(${tx.type}) success.`);
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

export function queryToObj(queryRes: any) {
  return JSON.parse(JSON.stringify(queryRes));
}

/**
 * Private functions
 */
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
