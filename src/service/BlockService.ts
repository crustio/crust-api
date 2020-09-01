import { Block } from 'crust-sdk'
import Endpoint from 'crust-sdk/api/common/Endpoint';

class NewSystemHealth {
    peers: number
    isSyncing: boolean
    shouldHavePeers: boolean
}

export default class BlockService {
    
    block: Block

    constructor(endpoint: Endpoint) {
        this.block = new Block(endpoint);
    }

    head = async () => {
        return await this.block.head()
    }

    sleep = (time : number) => {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    blockHash = async (blockNumber: number) => {
        return await this.block.blockHash(blockNumber)
    }

    systemHealth = async () => {
        let sh = await this.block.health()
        let nsh = new NewSystemHealth
        nsh.isSyncing = sh.isSyncing.isTrue
        nsh.peers = sh.peers.toNumber()
        nsh.shouldHavePeers = sh.shouldHavePeers.isTrue

        if (!nsh.isSyncing) {
            let h1 = await this.head()
            await this.sleep(3000)
            let h2 = await this.head()
            if (h1.number.toNumber() + 1 < h2.number.toNumber()) {
                nsh.isSyncing = true
            } 
        }

        return nsh
    }
    
}