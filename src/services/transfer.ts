import {ApiPromise} from '@polkadot/api';
import {Request} from 'express';
import {KeyringPair} from '@polkadot/keyring/types';
import {sendTx} from './util';
import {logger} from './index';

export async function transferCru(
  api: ApiPromise,
  krp: KeyringPair,
  req: Request
) {
  logger.info(
    `⚙️ [transfer]: Call transferCru with ${JSON.stringify(req.body)}`
  );
  const amount = req.body['amount'];
  const dest = req.body['dest'];
  const tx = api.tx.balances.transfer(dest, amount);

  return sendTx(tx, krp);
}

export async function transferCandy(
  api: ApiPromise,
  krp: KeyringPair,
  req: Request
) {
  logger.info(
    `⚙️ [transfer]: Call transferCandy with ${JSON.stringify(req.body)}`
  );
  const amount = req.body['amount'];
  const dest = req.body['dest'];
  const tx = api.tx.candy.transfer(dest, amount);

  return sendTx(tx, krp);
}
