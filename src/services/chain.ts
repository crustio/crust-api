import {ApiPromise} from '@polkadot/api';
import {logger} from './index';
import {sleep} from './util';

interface CrustHealth {
  peers: number;
  isSyncing: boolean;
  shouldHavePeers: boolean;
}

export async function header(api: ApiPromise) {
  logger.info('⛓ [chain]: Query chain header');
  return await api.rpc.chain.getHeader();
}

export async function blockHash(api: ApiPromise, bn: number) {
  logger.info(`⛓ [chain]: Query block hash with ${bn}`);
  return await api.query.system.blockHash(bn);
}

export async function health(api: ApiPromise) {
  logger.info('⛓ [chain]: Query systen health');
  const h = await api.rpc.system.health();
  const ch: CrustHealth = {
    isSyncing: h.isSyncing.isTrue,
    peers: h.peers.toNumber(),
    shouldHavePeers: h.shouldHavePeers.isTrue,
  };

  // HEALTH PATCH: This is for the poor syncing process
  if (!ch.isSyncing) {
    const h_before = await header(api);
    await sleep(3000);
    const h_after = await header(api);
    if (h_before.number.toNumber() + 1 < h_after.number.toNumber()) {
      ch.isSyncing = true;
    }
  }

  return ch;
}
