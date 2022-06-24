/* eslint-disable node/no-extraneous-import */
import {typesBundleForPolkadot} from '@crustio/type-definitions';
import {ApiPromise, WsProvider} from '@polkadot/api';
import {logger} from '@polkadot/util';
const l = logger('registration-chain-api');

export const registrationChainApi: ApiPromise = new ApiPromise({
  provider: new WsProvider(process.argv[4] || 'ws://localhost:9944'),
  typesBundle: typesBundleForPolkadot,
});

registrationChainApi.on('connected', () => {
  l.log(
    `Registration chain API has been connected to the endpoint: ${process.argv[4]}`
  );
});

registrationChainApi.on('disconnected', (): void => {
  l.error('Registration chain API has been disconnected from the endpoint');
  // eslint-disable-next-line no-process-exit
  process.exit(1);
});
