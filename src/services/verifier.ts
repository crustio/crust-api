/* eslint-disable node/no-extraneous-import */
import {ApiPromise, Keyring} from '@polkadot/api';
import {logger} from '../log';
import {KeyringPair} from '@polkadot/keyring/types';
import {handleSworkTxWithLock, queryToObj, sendTx} from './util';
import {Request} from 'express';
import {u8aToHex, stringToU8a} from '@polkadot/util';
import _ from 'lodash';

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

  const chainResult = queryToObj(
    await api.query.verifier.verificationResults(addr, pubKey)
  );

  if (_.isEmpty(chainResult)) {
    throw Error('Unable to get verification results');
  } else {
    const kr = new Keyring({
      type: 'sr25519',
    });

    const result = chainResult.map((e: any) => {
      return {
        payload: {
          ...e.payload,
          who: u8aToHex(kr.decodeAddress(e.payload.who)),
        },
        signature: e.signature,
      };
    });
    return result;
  }
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
