import {ApiPromise} from '@polkadot/api';
import {Request} from 'express';
import {KeyringPair} from '@polkadot/keyring/types';
import {sendTx, queryToObj} from './util';
import {logger} from './index';

/**
 * Send extrinsics
 */
export async function register(
  api: ApiPromise,
  krp: KeyringPair,
  req: Request
) {
  logger.info(`⚙️ [swork]: Call register with ${JSON.stringify(req.body)}`);
  const tx = api.tx.swork.register(
    req.body['ias_sig'],
    req.body['ias_cert'],
    req.body['account_id'],
    req.body['isv_body'],
    '0x' + req.body['sig']
  );

  return sendTx(tx, krp);
}

export async function reportWorks(
  api: ApiPromise,
  krp: KeyringPair,
  req: Request
) {
  logger.info(`⚙️ [swork]: Call report works with ${JSON.stringify(req.body)}`);
  const bn = req.body['block_height'];
  const pk = '0x' + req.body['pub_key'];
  const tx = api.tx.swork.reportWorks(
    pk,
    '0x' + req.body['pre_pub_key'],
    bn,
    '0x' + req.body['block_hash'],
    req.body['reserved'],
    req.body['files_size'],
    req.body['added_files'].map((file: any) => {
      const rst: [string, number] = ['0x' + file.hash, file.size];
      return rst;
    }),
    req.body['deleted_files'].map((file: any) => {
      const rst: [string, number] = ['0x' + file.hash, file.size];
      return rst;
    }),
    '0x' + req.body['reserved_root'],
    '0x' + req.body['files_root'],
    '0x' + req.body['sig']
  );

  const txRes = queryToObj(await sendTx(tx, krp));
  if (txRes && 'success' === txRes.status) {
    // Query work report
    const wr = queryToObj(await api.query.swork.workReports(pk));
    // ⚠️ WARNING: inblocked but not recorded
    if (wr['report_slot'] !== bn) {
      logger.warn(
        `  ↪ ⚙️ [swork]: report works invalid in slot=${bn} with pk=${pk}`
      );
      txRes.status = 'failed';
      txRes.message = 'Report works success but not in block.';
    }
  }

  return txRes;
}

/**
 * Queries
 */
export async function identity(api: ApiPromise, addr: string) {
  logger.info(`⚙️ [swork]: Query identity with ${addr}`);
  const pks: string[] = queryToObj(await api.query.swork.idBonds(addr));

  // TODO: use `bluebird` to limit the promise concurrencies
  return Promise.all(
    pks.map(async pk => ({
      pub_key: pk,
      code: (await api.query.swork.identities(pk)).toString(),
    }))
  );
}

export async function workReport(api: ApiPromise, addr: string) {
  logger.info(`⚙️ [swork]: Query work report with ${addr}`);
  const pks: string[] = queryToObj(await api.query.swork.idBonds(addr));

  // TODO: use `bluebird` to limit the promise concurrencies
  const wrs = await Promise.all(
    pks.map(async pk => {
      const wr = queryToObj(await api.query.swork.workReports(pk));
      if (wr) wr.pub_key = pk;
      return wr;
    })
  );
  return wrs.filter(wr => wr);
}

export async function code(api: ApiPromise) {
  logger.info('⚙️ [swork]: Query sworker code');
  return api.query.swork.code();
}
