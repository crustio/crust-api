import {ApiPromise} from '@polkadot/api';
import {Request} from 'express';
import {KeyringPair} from '@polkadot/keyring/types';
import {sendTx, getHexValue, queryToObj} from './util';
import {logger} from './index';

export async function merchant(api: ApiPromise, addr: string) {
  logger.info(`📦 [market]: Query merchant with address: ${addr}`);
  const m = queryToObj(await api.query.market.merchants(addr));
  if (m) {
    m.file_map = Object.assign(
      {},
      ...m.file_map.map((f: any[]) => ({[f[0]]: f[1]}))
    );
    m.address = getHexValue(m.address);
  }
  return m;
}

export async function sorder(api: ApiPromise, id: string) {
  logger.info(`📦 [market]: Query storage order with order id: ${id}`);
  return api.query.market.sorderInfos(id);
}

export async function register(
  api: ApiPromise,
  krp: KeyringPair,
  req: Request
) {
  logger.info(
    `📦 [market]: Call market register with ${JSON.stringify(req.body)}`
  );
  const tx = api.tx.market.register(
    req.body['addressInfo'],
    req.body['storagePrice']
  );
  return sendTx(tx, krp);
}

export async function placeSorder(
  api: ApiPromise,
  krp: KeyringPair,
  req: Request
) {
  logger.info(
    `📦 [market]: Place an storage order with ${JSON.stringify(req.body)}`
  );
  const sorderInfo = JSON.parse(req.body['sorder']);
  const tx = api.tx.market.placeStorageOrder(
    sorderInfo.merchant,
    sorderInfo.fileIdentifier,
    sorderInfo.fileSize,
    sorderInfo.duration,
    '0x00' // TODO: `FileAlias`, use default value
  );

  const txRes = queryToObj(await sendTx(tx, krp));
  if (txRes && 'success' === txRes.status) {
    // Query merchant info and get storage order id
    const m = await merchant(api, sorderInfo.merchant);
    if (m) {
      const f_map = m.file_map;
      for (const f_id in f_map) {
        if (f_id === sorderInfo.fileIdentifier) {
          const sorders = f_map[f_id];
          if (sorders.length > 0) txRes.order_id = sorders[0];
        }
      }
    }
  }

  return txRes;
}
