import { ApiPromise } from '@polkadot/api';

export async function header(api: ApiPromise) {
  return await api.rpc.chain.getHeader();
}
