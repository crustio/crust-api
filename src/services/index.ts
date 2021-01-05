import {Request, Response, NextFunction} from 'express';
import {ApiPromise, WsProvider} from '@polkadot/api';
import {blockHash, header, health} from './chain';
import {register, reportWorks, workReport, code, identity} from './swork';
import {file} from './market';
import {loadKeyringPair, resHandler, withApiReady} from './util';
import {logger} from '../log';

// TODO: Better result
export interface TxRes {
  status?: string;
  message?: string;
  details?: string;
}

const types = {
  Address: 'AccountId',
  AddressInfo: 'Vec<u8>',
  ETHAddress: 'Vec<u8>',
  FileAlias: 'Vec<u8>',
  FileInfo: {
    file_size: 'u64',
    expired_on: 'BlockNumber',
    claimed_at: 'BlockNumber',
    amount: 'Balance',
    expected_replica_count: 'u32',
    reported_replica_count: 'u32',
    replicas: 'Vec<Replica<AccountId>>',
  },
  Guarantee: {
    targets: 'Vec<IndividualExposure<AccountId, Balance>>',
    total: 'Compact<Balance>',
    submitted_in: 'EraIndex',
    suppressed: 'bool',
  },
  IASSig: 'Vec<u8>',
  Identity: {
    anchor: 'SworkerAnchor',
    group: 'Option<AccountId>',
  },
  ISVBody: 'Vec<u8>',
  LookupSource: 'AccountId',
  MerchantLedger: {
    reward: 'Balance',
    pledge: 'Balance',
  },
  MerkleRoot: 'Vec<u8>',
  ReportSlot: 'u64',
  Replica: {
    who: 'AccountId',
    valid_at: 'BlockNumber',
    anchor: 'SworkerAnchor',
  },
  Releases: {
    _enum: ['V1_0_0', 'V2_0_0'],
  },
  PKInfo: {
    code: 'SworkerCode',
    anchor: 'Option<SworkerAnchor>',
  },
  Status: {
    _enum: ['Free', 'Reserved'],
  },
  SworkerAnchor: 'Vec<u8>',
  SworkerCert: 'Vec<u8>',
  SworkerCode: 'Vec<u8>',
  SworkerPubKey: 'Vec<u8>',
  SworkerSignature: 'Vec<u8>',
  UsedInfo: {
    used_size: 'u64',
    groups: 'BTreeSet<SworkerAnchor>',
  },
  WorkReport: {
    report_slot: 'u64',
    used: 'u64',
    free: 'u64',
    reported_files_size: 'u64',
    reported_srd_root: 'MerkleRoot',
    reported_files_root: 'MerkleRoot',
  },
};

let api: ApiPromise = newApiPromise();

export const initApi = () => {
  if (api && api.disconnect) {
    logger.info('⚠️  Disconnecting from old api...');
    api
      .disconnect()
      .then(() => {})
      .catch(() => {});
  }
  api = newApiPromise();
  api.isReady.then(api => {
    logger.info(
      `⚡️ [global] Current chain info: ${api.runtimeChain}, ${api.runtimeVersion}`
    );
  });
};

export const getApi = (): ApiPromise => {
  return api;
};

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
      await resHandler(register(api, krp, req), res);
    }, next);
  },
  reportWorks: (req: Request, res: Response, next: NextFunction) => {
    withApiReady(async (api: ApiPromise) => {
      const krp = loadKeyringPair(req);
      await resHandler(reportWorks(api, krp, req), res);
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
  file: (req: Request, res: Response, next: NextFunction) => {
    withApiReady(async (api: ApiPromise) => {
      res.json(await file(api, String(req.query['cid'])));
    }, next);
  },
};

function newApiPromise(): ApiPromise {
  return new ApiPromise({
    provider: new WsProvider(process.argv[3] || 'ws://localhost:9944'),
    types,
  });
}
