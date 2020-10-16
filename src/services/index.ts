import {Request, Response} from 'express';
import {ApiPromise, WsProvider} from '@polkadot/api';
import {header} from './block';
import {register, reportWorks, workReport, code, identity} from './swork';
import {loadKeyringPair} from './util';

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
    files: 'Vec<Vec<u8>, u64>',
    reported_files_size: 'u64',
    reported_srd_root: 'Vec<u8>',
    reported_files_root: 'Vec<u8>',
  },
};

export const api = new ApiPromise({
  provider: new WsProvider(process.argv[3] || 'ws://localhost:9944'),
  types,
});

export const block = {
  header: (_: Request, res: Response) => {
    api.isReady.then(async api => {
      const h = await header(api);
      res.json({
        number: h.number,
        hash: h.hash,
      });
    });
  },
};

export const swork = {
  register: (req: Request, res: Response, next: any) => {
    api.isReady.then(async api => {
      try {
        const krp = loadKeyringPair(req);
        await register(api, krp, req, res);
      } catch (error) {
        next(error);
      }
    });
  },
  reportWorks: (req: Request, res: Response, next: any) => {
    api.isReady.then(async api => {
      try {
        const krp = loadKeyringPair(req);
        await reportWorks(api, krp, req, res);
      } catch (error) {
        next(error);
      }
    });
  },
  workReport: (req: Request, res: Response, next: any) => {
    api.isReady.then(async api => {
      try {
        await workReport(api, req, res);
      } catch (error) {
        next(error);
      }
    });
  },
  code: (req: Request, res: Response, next: any) => {
    api.isReady.then(async api => {
      try {
        await code(api, req, res);
      } catch (error) {
        next(error);
      }
    });
  },
  identity: (req: Request, res: Response, next: any) => {
    api.isReady.then(async api => {
      try {
        await identity(api, req, res);
      } catch (error) {
        next(error);
      }
    });
  },
};
