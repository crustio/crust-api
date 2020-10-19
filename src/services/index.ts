import {Request, Response, NextFunction} from 'express';
import {ApiPromise, WsProvider} from '@polkadot/api';
import {header} from './block';
import {register, reportWorks, workReport, code, identity} from './swork';
import {loadKeyringPair, withApiReady} from './util';

export const types = {
  Address: 'AccountId',
  AddressInfo: 'Vec<u8>',
  FileAlias: 'Vec<u8>',
  Guarantee: {
    targets: 'Vec<IndividualExposure<AccountId, Balance>>',
    total: 'Compact<Balance>',
    submitted_in: 'EraIndex',
    suppressed: 'bool',
  },
  IASSig: 'Vec<u8>',
  Identity: {
    pub_key: 'Vec<u8>',
    code: 'Vec<u8>',
  },
  ISVBody: 'Vec<u8>',
  LookupSource: 'AccountId',
  MerchantInfo: {
    address: 'Vec<u8>',
    storage_price: 'Balance',
    file_map: 'Vec<(Vec<u8>, Vec<Hash>)>',
  },
  MerchantPunishment: {
    success: 'EraIndex',
    failed: 'EraIndex',
    value: 'Balance',
  },
  MerkleRoot: 'Vec<u8>',
  OrderStatus: {
    _enum: ['Success', 'Failed', 'Pending'],
  },
  PaymentLedger: {
    total: 'Balance',
    paid: 'Balance',
    unreserved: 'Balance',
  },
  Pledge: {
    total: 'Balance',
    used: 'Balance',
  },
  ReportSlot: 'u64',
  Releases: {
    _enum: ['V1_0_0', 'V2_0_0'],
  },
  Status: {
    _enum: ['Free', 'Reserved'],
  },
  StorageOrder: {
    file_identifier: 'Vec<u8>',
    file_size: 'u64',
    created_on: 'BlockNumber',
    completed_on: 'BlockNumber',
    expired_on: 'BlockNumber',
    provider: 'AccountId',
    client: 'AccountId',
    amount: 'Balance',
    order_status: 'OrderStatus',
  },
  SworkerCert: 'Vec<u8>',
  SworkerCode: 'Vec<u8>',
  SworkerPubKey: 'Vec<u8>',
  SworkerSignature: 'Vec<u8>',
  WorkReport: {
    report_slot: 'u64',
    used: 'u64',
    free: 'u64',
    files: 'BTreeMap<MerkleRoot, u64>',
    reported_files_size: 'u64',
    reported_srd_root: 'MerkleRoot',
    reported_files_root: 'MerkleRoot',
  },
};

// TODO: Better result
export interface TxRes {
  status?: string;
  message?: string;
  details?: string;
}

export const api = new ApiPromise({
  provider: new WsProvider(process.argv[3] || 'ws://192.168.50.140:9931'),
  types,
});

export const block = {
  header: (_: Request, res: Response, next: NextFunction) => {
    withApiReady(async (api: ApiPromise) => {
      const h = await header(api);
      res.json({
        number: h.number,
        hash: h.hash,
      });
    }, next);
  },
};

export const swork = {
  register: (req: Request, res: Response, next: NextFunction) => {
    withApiReady(async (api: ApiPromise) => {
      const krp = loadKeyringPair(req);
      res.json(await register(api, krp, req));
    }, next);
  },
  reportWorks: (req: Request, res: Response, next: NextFunction) => {
    withApiReady(async (api: ApiPromise) => {
      const krp = loadKeyringPair(req);
      res.json(await reportWorks(api, krp, req));
    }, next);
  },
  identity: (req: Request, res: Response, next: NextFunction) => {
    withApiReady(async (api: ApiPromise) => {
      res.json(await identity(api, req));
    }, next);
  },
  workReport: (req: Request, res: Response, next: NextFunction) => {
    withApiReady(async (api: ApiPromise) => {
      res.json(await workReport(api, req));
    }, next);
  },
  code: (_: Request, res: Response, next: NextFunction) => {
    withApiReady(async (api: ApiPromise) => {
      res.json(await code(api));
    }, next);
  },
};
