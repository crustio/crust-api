/* eslint-disable node/no-extraneous-import */
import {ApiPromise} from '@polkadot/api';
import {logger} from '../log';
import {KeyringPair} from '@polkadot/keyring/types';
import {handleSworkTxWithLock, sendTx} from './util';
import {Request} from 'express';
import {u8aToHex, stringToU8a} from '@polkadot/util';

/**
 * Queries
 */
export async function verificationResults(
  api: ApiPromise,
  addr: string,
  pubKey: string
) {
  logger.info(
    `⚙️ [swork]: Query verification results with ${addr} pubKey ${pubKey}`
  );

  return await api.query.verifier.verificationResults(addr, pubKey);
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

  const evidence = u8aToHex(stringToU8a(req.body['evidence']));

  const tx = api.tx.verifier.requestVerification(evidence);

  return handleSworkTxWithLock(async () => sendTx(api, tx, krp));
}
