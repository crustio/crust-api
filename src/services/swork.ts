import { ApiPromise } from '@polkadot/api';
import { Request, Response } from 'express';
import { KeyringPair } from '@polkadot/keyring/types';
import { extrinsicResult, convertToObj } from './util';

export async function register(
  api: ApiPromise,
  krp: KeyringPair,
  req: Request,
  res: Response
) {
  const action = 'register';
  const tx = api.tx.swork.register(
    req.body['ias_sig'],
    req.body['ias_cert'],
    req.body['account_id'],
    req.body['isv_body'],
    '0x' + req.body['sig']
  );

  res.send(await extrinsicResult({ tx, api, krp, action }));
}

export async function reportWorks(
  api: ApiPromise,
  krp: KeyringPair,
  req: Request,
  res: Response
) {
  const action = 'reportWorks';
  const tx = api.tx.swork.reportWorks(
    '0x' + req.body['pub_key'],
    '0x' + req.body['pre_pub_key'],
    req.body['block_height'],
    '0x' + req.body['block_hash'],
    req.body['reserved'],
    req.body['files_size'],
    req.body['added_files'].map((file: any) => {
      const rst: [any, any] = ['0x' + file.hash, file.size];
      return rst;
    }),
    req.body['deleted_files'].map((file: any) => {
      const rst: [any, any] = ['0x' + file.hash, file.size];
      return rst;
    }),
    '0x' + req.body['reserved_root'],
    '0x' + req.body['files_root'],
    '0x' + req.body['sig']
  );

  res.send(await extrinsicResult({ tx, api, krp, action }));
}

export async function workReport(api: ApiPromise, req: Request, res: Response) {
  const address = req.query['address'];
  if (typeof address !== 'string') {
    res
      .status(400)
      .send('Please add address (type is string) to the url query.');
    return;
  }
  const pubKeys = convertToObj(await api.query.swork.idBonds(address));
  const result = [];
  if (pubKeys && Array.isArray(pubKeys)) {
    for (const pubKey of pubKeys) {
      const workReport = convertToObj(
        await api.query.swork.workReports(pubKey)
      );
      if (workReport) {
        result.push({ ...workReport, pub_key: pubKey });
      }
    }
  }
  res.send(result);
}

export async function code(api: ApiPromise, req: Request, res: Response) {
  res.send(await api.query.swork.code());
}

export async function identity(api: ApiPromise, req: Request, res: Response) {
  const address = req.query['address'];
  if (typeof address !== 'string') {
    res
      .status(400)
      .send('Please add address (type is string) to the url query.');
    return;
  }
  const pubKeys = convertToObj(await api.query.swork.idBonds(address));
  const result = [];
  if (pubKeys && Array.isArray(pubKeys)) {
      for (const pubKey of pubKeys) {
          result.push({ 'pub_key': pubKey, code: convertToObj(await api.query.swork.identities(pubKey))});
      }
  }
  res.send(result);
}