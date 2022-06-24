import {ApiPromise} from '@polkadot/api';
import {logger} from '../log';
import {KeyringPair} from '@polkadot/keyring/types';
import {handleSworkTxWithLock, sendTx} from './util';
import {Request} from 'express';

/**
 * Queries
 */
export async function verificationResults(api: ApiPromise, addr: string) {
  logger.info(`⚙️ [swork]: Query verification results with ${addr}`);

  return await api.query.verifier.verificationResults(addr);
}

/**
 * Send extrinsics
 */
export async function requestVerification(
  api: ApiPromise,
  krp: KeyringPair,
  req: Request
) {
  logger.info(
    `⚙️ [swork]: Call verifier requestVerification with ${JSON.stringify(
      req.body
    )}`
  );
  const tx = api.tx.verifier.requestVerification('0x' + req.body['evidence']);

  return handleSworkTxWithLock(async () => sendTx(api, tx, krp));
}
