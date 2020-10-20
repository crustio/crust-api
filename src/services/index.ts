import {Request, Response, NextFunction} from 'express';
import {ApiPromise, WsProvider} from '@polkadot/api';
import {blockHash, header, health} from './chain';
import {register, reportWorks, workReport, code, identity} from './swork';
import {
  merchant,
  sorder,
  placeSorder,
  register as registerMerchant,
} from './market';
import {loadKeyringPair, withApiReady} from './util';
import {createLogger, format, transports} from 'winston';

export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.colorize(),
    format.errors({stack: true}),
    format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [
    //
    // - Write to all logs with level `info` and below to `crust-api-combined.log`.
    // - Write all logs error (and below) to `crust-api-error.log`.
    //
    new transports.Console(),
    new transports.File({filename: 'crust-api-error.log', level: 'error'}),
    new transports.File({filename: 'crust-api-combined.log'}),
  ],
});

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
  SorderInfo: {
    file_identifier: 'MerkleRoot',
    file_size: 'u64',
    created_on: 'BlockNumber',
    merchant: 'AccountId',
    client: 'AccountId',
    amount: 'Balance',
    duration: 'BlockNumber',
  },
  SorderStatus: {
    completed_on: 'BlockNumber',
    expired_on: 'BlockNumber',
    status: 'OrderStatus',
    claimed_at: 'BlockNumber',
  },
  SorderPunishment: {
    success: 'BlockNumber',
    failed: 'BlockNumber',
    updated_at: 'BlockNumber',
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
  provider: new WsProvider(process.argv[3] || 'ws://localhost:9933'),
  types,
});

export const chain = {
  header: (_: Request, res: Response, next: NextFunction) => {
    withApiReady(async (api: ApiPromise) => {
      const h = await header(api);
      res.json({
        number: h.number,
        hash: h.hash,
      });
    }, next);
  },
  blockHash: (req: Request, res: Response, next: NextFunction) => {
    withApiReady(async (api: ApiPromise) => {
      res.send(await blockHash(api, Number(req.query['blockNumber'])));
    }, next);
  },
  health: (_: Request, res: Response, next: NextFunction) => {
    withApiReady(async (api: ApiPromise) => {
      res.json(await health(api));
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
      res.json(await identity(api, String(req.query['address'])));
    }, next);
  },
  workReport: (req: Request, res: Response, next: NextFunction) => {
    withApiReady(async (api: ApiPromise) => {
      res.json(await workReport(api, String(req.query['address'])));
    }, next);
  },
  code: (_: Request, res: Response, next: NextFunction) => {
    withApiReady(async (api: ApiPromise) => {
      res.json(await code(api));
    }, next);
  },
};

export const market = {
  merchant: (req: Request, res: Response, next: NextFunction) => {
    withApiReady(async (api: ApiPromise) => {
      res.json(await merchant(api, String(req.query['address'])));
    }, next);
  },
  sorder: (req: Request, res: Response, next: NextFunction) => {
    withApiReady(async (api: ApiPromise) => {
      res.json(await sorder(api, String(req.query['orderId'])));
    }, next);
  },
  register: (req: Request, res: Response, next: NextFunction) => {
    withApiReady(async (api: ApiPromise) => {
      const krp = loadKeyringPair(req);
      res.json(await registerMerchant(api, krp, req));
    }, next);
  },
  placeSorder: (req: Request, res: Response, next: NextFunction) => {
    withApiReady(async (api: ApiPromise) => {
      const krp = loadKeyringPair(req);
      res.json(await placeSorder(api, krp, req));
    }, next);
  },
};
