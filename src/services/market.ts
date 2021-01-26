import {ApiPromise} from '@polkadot/api';
import {queryToObj} from './util';
import {logger} from '../log';

// Queries
export async function file(api: ApiPromise, cid: string) {
  logger.info(`📦 [market]: Query file order with cid: ${cid}`);
  const [fileInfo, _usedInfo] = queryToObj(await api.query.market.files(cid));
  return fileInfo;
}
