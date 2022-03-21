/* eslint-disable node/no-extraneous-import */
import {NextFunction, Request, Response} from 'express';
import {Keyring} from '@polkadot/keyring';
import {KeyringPair} from '@polkadot/keyring/types';
import {DispatchError} from '@polkadot/types/interfaces';
import {ITuple} from '@polkadot/types/types';
import {SubmittableExtrinsic} from '@polkadot/api/promise/types';
import {timeout} from 'promise-timeout';
import {TxRes, getApi} from './index';
import {logger} from '../log';

const txLocker = {swork: false};
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
    tx.signAndSend(krp, ({events = [], status}) => {
      logger.info(
        `  ↪ 💸 [tx]: Transaction status: ${status.type}, nonce: ${tx.nonce}`
      );

      if (status.isInvalid || status.isDropped || status.isUsurped || status.isRetracted) {
        reject(new Error(`${status.type} transaction.`));
      } else {
        // Pass it
      }

      if (status.isFinalized) {
        events.forEach(({event: {data, method, section}}) => {
          if (section === 'system' && method === 'ExtrinsicFailed') {
            const [dispatchError] = data as unknown as ITuple<[DispatchError]>;
            const result: TxRes = {
              status: 'failed',
              message: dispatchError.type,
            };
            // Can get detail error info
            if (dispatchError.isModule) {
              const mod = dispatchError.asModule;
              const error = getApi().registry.findMetaError(
                new Uint8Array([mod.index.toNumber(), mod.error.toNumber()])
              );
              result.message = `${error.section}.${error.name}`;
              result.details = error.documentation.join('');
            }

            logger.info(
              `  ↪ 💸 ❌ [tx]: Send transaction(${tx.type}) failed with ${result.message}.`
            );
            resolve(result);
          } else if (method === 'ExtrinsicSuccess') {
            const result: TxRes = {
              status: 'success',
            };

            logger.info(
              `  ↪ 💸 ✅ [tx]: Send transaction(${tx.type}) success.`
            );
            resolve(result);
          }
        });
      } else {
        // Pass it
      }
    }).catch(e => {
      reject(e);
    });
  });
}

export function queryToObj(queryRes: any) {
  return JSON.parse(JSON.stringify(queryRes));
}

export async function withApiReady(fn: Function, next: NextFunction) {
  const api = getApi();
  if (!api || !api.isConnected) {
    next(new Error('⚠️  Chain is offline, please connect a running chain.'));
    return;
  }
  try {
    const matureApi = await api.isReady;
    await fn(matureApi);
    next();
  } catch (err) {
    next(err);
  }
}

export async function resHandler(req: Promise<any>, res: Response) {
  const txRes: any = await req;
  if (txRes && 'success' === txRes.status) {
    res.json(txRes);
  } else {
    res.status(400).json(txRes);
  }
}

export function sleep(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}

export async function handleSworkTxWithLock(handler: Function) {
  if (txLocker.swork) {
    return {
      status: 'failed',
      details: 'Tx Locked',
    };
  }

  try {
    txLocker.swork = true;
    return await timeout(
      new Promise((resolve, reject) => {
        handler().then(resolve).catch(reject);
      }),
      7 * 60 * 1000 // 7 min, for valid till checking
    );
  } finally {
    txLocker.swork = false;
  }
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

export function strToHex(str: string): string {
  return '0x' + Buffer.from(str).toString('hex');
}
