import { Block } from 'crust-sdk'
import Endpoint from 'crust-sdk/api/common/Endpoint';

export default class BlockService {
    
    block: Block

    constructor(endpoint: Endpoint) {
        this.block = new Block(endpoint);
    }

    head = async () => {
        return await this.block.head()
    }

    blockHash = async (blockNumber: number) => {
        return await this.block.blockHash(blockNumber)
    }

    systemHealth = async () => {
        return await this.block.health()
    }
    
}