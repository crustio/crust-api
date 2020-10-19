import {ApiPromise} from '@polkadot/api';
import {Request} from 'express';
import {KeyringPair} from '@polkadot/keyring/types';
import {sendTx, queryToObj} from './util';

/**
 * Send extrinsics
 */
export async function register(
  api: ApiPromise,
  krp: KeyringPair,
  req: Request
) {
  const tx = api.tx.swork.register(
    req.body['ias_sig'],
    req.body['ias_cert'],
    req.body['account_id'],
    req.body['isv_body'],
    '0x' + req.body['sig']
  );

  return await sendTx(tx, krp);
}

export async function reportWorks(
  api: ApiPromise,
  krp: KeyringPair,
  req: Request
) {
  const tx = api.tx.swork.reportWorks(
    '0x' + req.body['pub_key'],
    '0x' + req.body['pre_pub_key'],
    req.body['block_height'],
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

  return await sendTx(tx, krp);
}

/**
 * Queries
 */
export async function identity(api: ApiPromise, req: Request) {
  const address = req.query['address'];
  const pks: string[] = queryToObj(await api.query.swork.idBonds(address));
  return await Promise.all(
    pks.map(async pk => ({
      pub_key: pk,
      code: (await api.query.swork.identities(pk)).toString(),
    }))
  );
}

export async function workReport(api: ApiPromise, req: Request) {
  const address = req.query['address'];
  const pks: string[] = queryToObj(await api.query.swork.idBonds(address));
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
  return await api.query.swork.code();
}
