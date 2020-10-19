import {ApiPromise} from '@polkadot/api';
import {logger} from './index';

export async function header(api: ApiPromise) {
  logger.info('⛓ [chain]: Query chain header');
  return await api.rpc.chain.getHeader();
}
