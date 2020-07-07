import { Block } from 'crust-sdk';
import Endpoint from 'crust-sdk/api/common/Endpoint';
export default class BlockService {
    block: Block;
    constructor(endpoint: Endpoint);
    head: () => Promise<import("crust-sdk/model/LastHead").default>;
    blockHash: (blockNumber: number) => Promise<import("@polkadot/types/interfaces").Hash>;
}
