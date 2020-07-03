import * as express from 'express';
import * as bodyParser from 'body-parser';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/api';
import Endpoint from 'crust-sdk/api/common/Endpoint';
import BlockService from './service/BlockService';
import TeeService from './service/TeeService';
import MarketService from './service/MarketService';
import AccountService from './service/AccountService';
import { StorageOrder } from 'crust-sdk/api/Market';
import { WsReConnectable } from './aop/WsReConnectable';

const moment = require('moment');
const winston = require('winston');
const logConfiguration = require('./logconfig');
const logger = winston.createLogger(logConfiguration);

// Creates and configures an ExpressJS web server.
class App {

    // ref to Express instance
    public express: express.Application;
    api: Promise<ApiPromise>;

    host: string;

    endpoint: Endpoint;

    blockService: BlockService;
    teeService: TeeService;
    marketService: MarketService;
    accountService: AccountService;
    //Run configuration methods on the Express instance.
    constructor(crust_chain_endpoint: string) {
        this.express = express();
        this.middleware();
        this.routes();
        // this.api = new Endpoint('ws://fzk2.crust.run:7080/').api;
        this.host = crust_chain_endpoint;
        this.initService();
    }

    
    private initService() {
        this.endpoint = new Endpoint(this.host);
        this.blockService = new BlockService(this.endpoint);
        this.teeService = new TeeService(this.endpoint);
        this.marketService = new MarketService(this.endpoint);
        this.accountService = new AccountService(this.endpoint);
    }

    reconnectWS() {
        logger.info('ws reconnect')
        this.initService();
        logger.info('ws reconnected at' + moment().format())
    }

    // get function 
    @WsReConnectable
    async head() {
        return await this.blockService.head()
    }

    @WsReConnectable
    async blockHash(blockNumber: number) {
        return await this.blockService.blockHash(blockNumber)
    }

    @WsReConnectable
    async identity(address: string) {
        return await this.teeService.identity(address);
    }

    @WsReConnectable
    async workReports(address: string) {
        return await this.teeService.workReports(address);
    }

    @WsReConnectable
    async providers(address: string) {
        return await this.marketService.providers(address);
    }

    @WsReConnectable
    async storageOrders(address: string) {
        return await this.marketService.storageOrders(address);
    }

    // post function 
    @WsReConnectable
    async registerIdentity(backup: string, identity: any, rootPass: string) {
        return await this.teeService.registerIdentity(backup, identity, rootPass);
    }

    @WsReConnectable
    async reportWorks(backup: string, workReport: any, rootPass: string) {
        return await this.teeService.reportWorks(backup, workReport, rootPass);
    }

    @WsReConnectable
    async register(backup: string, addressInfo: string, rootPass: string) {
        return await this.marketService.register(backup, addressInfo, rootPass);
    }

    @WsReConnectable
    async sorder(backup: string, storageOrder: StorageOrder, rootPass: string) {
        return await await this.marketService.sorder(backup, storageOrder , rootPass);
    }

    @WsReConnectable
    async transfer(backup: string, dest: string, amount: number, rootPass: string) {
        return await this.accountService.transfer(backup, dest, amount, rootPass);
    }

    

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }

    // Hex string to bytes
    private hexStr2Bytes(str: string) {
        let pos = 0;
        let len = str.length;
        if (len % 2 != 0) {
            return null;
        }

        len /= 2;
        let hexA = new Array();
        for (let i = 0; i < len; i++) {
            let s = str.substr(pos, 2);
            let v = parseInt(s, 16);
            hexA.push(v);
            pos += 2;
        }

        return hexA;
    }

    private bin2String(hexStr: string) {
        if (hexStr.substring(0, 2) != "0x") {
            return null
        }
        const realHexStr = hexStr.substring(2);
        const bytes = this.hexStr2Bytes(realHexStr);

        let result = "";
        for (let i = 0; i < bytes.length; i++) {
            result += String.fromCharCode(bytes[i]);
        }
        return result;
    }

    // Generate user from backup and password
    private generateUser(backup: string, password: string) {
        const user = new Keyring({ type: 'sr25519' }).addFromJson(JSON.parse(backup));
        user.decodePkcs8(password);
        return user;
    }

    // Configure API endpoints.
    private routes(): void {
        let router = express.Router();

        router.get('/', (req, res, next) => {
            logger.info('request path:' + '/' +', request time: ' + moment().format())
            res.json({
                message: 'This is crust api.'
            });
        });

        router.get('/api/v1/block/header', async (req, res, next) => {
            logger.info('request path: ' + '/api/v1/block/header' +', request time: ' + moment().format())
            res.send(await this.head());     
        });

        router.get('/api/v1/block/hash',async (req, res, next) => {
            console.log('this.api', this.api)
            logger.info('request path: ' + '/api/v1/block/hash' +', request time: ' + moment().format())
            // Get address
            const blockNumber = req.query["blockNumber"];
            if (typeof blockNumber !== "string") {
                res.status(400).send('Please add block number (type is string) to the url query.');
                return;
            }

            // Use api to get block hash by number
            res.send(await this.blockHash(Number(blockNumber)));
            
        });

        router.get('/api/v1/tee/identity', async (req, res, next) => {
            logger.info('request path: ' + '/api/v1/tee/identity' +', request time: ' + moment().format())
            // Get address
            const address = req.query["address"];
            if (typeof address !== "string") {
                res.status(400).send('Please add address (type is string) to the url query.');
                return;
            }
            // Use api to get tee identities
            res.send(await this.identity(address))
            
        });

        router.get('/api/v1/tee/workreport', async (req, res, next) => {
            logger.info('request path: ' + '/api/v1/tee/workreport' +', request time: ' + moment().format())
            // Get address
            const address = req.query["address"];
            if (typeof address !== "string") {
                res.status(400).send('Please add address (type is string) to the url query.');
                return;
            }
            // Use api to get work report
            res.send(await this.workReports(address))
            
        });

        router.get('/api/v1/market/provider', async (req, res, next) => {
            logger.info('request path: ' + '/api/v1/market/provider' +', request time: ' + moment().format())
            // 1. Get address
            const address = req.query["address"];
            if (typeof address !== "string") {
                res.status(400).send('Please add provider\'s address (type is string) to the url query.');
                return;
            }

            // 2. Use api to get provider's info
            res.send(await this.providers(address))
            
        });

        router.get('/api/v1/market/sorder', async (req, res, next) => {
            logger.info('request path: ' + '/api/v1/market/sorder' +', request time: ' + moment().format())
            // 1. Get order id
            const orderId = req.query["orderId"];
            if (typeof orderId !== "string") {
                res.status(400).send('Please add storage order id (type is string) to the url query.');
                return;
            }

            // 2. Use api to get storage order
            res.send(await this.storageOrders(orderId))
            
        });

        router.post('/api/v1/tee/identity', async (req, res, next) => {
            logger.info('request path: ' + '/api/v1/tee/identity' +', request time: ' + moment().format())
            console.log('req.body', req.body)
            const identity = {
                ias_sig: req.body["ias_sig"],
                ias_cert: req.body["ias_cert"],
                account_id: req.body["account_id"],
                isv_body: req.body["isv_body"],
                pub_key: "0x",
                sig: "0x" + req.body["sig"]
            }

            logger.info(`request param ${identity}, time: ${moment().format()}`)

            //Get backup
            const backup = req.body["backup"];
            if (typeof backup !== "string") {
                res.status(400).send('Please add backup (type is string) to the request body.');
                return;
            }
            
            //Get password
            const password = req.headers["password"];
            if (typeof password !== "string") {
                res.status(400).send('Please add password (type is string) to the request header.');
                return;
            }

            res.send(await this.registerIdentity(backup, identity, password))
        });

        router.post('/api/v1/tee/workreport', async (req, res, next) => {
            logger.info('request path: ' + '/api/v1/tee/workreport' +', request time: ' + moment().format())
            console.log('req.body', req.body)
            const workReport = {
                pub_key: "0x" + req.body["pub_key"],
                block_number: req.body["block_height"],
                block_hash: "0x" + req.body["block_hash"],
                used: 0,
                reserved: req.body["reserved"],
                files: req.body["files"].map((file: any) => {
                    const rst: [any, any] = ["0x" + file.hash, file.size]
                    return rst;
                }),
                sig: "0x" + req.body["sig"]
            }
            logger.info(`request param ${JSON.stringify(workReport)}, time: ${moment().format()}`)

            //Get backup
            const backup = req.body["backup"];
            if (typeof backup !== "string") {
                res.status(400).send('Please add backup (type is string) to the request body.');
                return;
            }
            
            //Get password
            const password = req.headers["password"];
            if (typeof password !== "string") {
                res.status(400).send('Please add password (type is string) to the request header.');
                return;
            }
            
            res.send(await this.reportWorks(backup, workReport, password))
            
        });

        router.post('/api/v1/market/register', async (req, res, next) => {
            logger.info('request path: ' + '/api/v1/market/register' +', request time: ' + moment().format())
            // 1. Get and check address info
            const addressInfo = req.body['addressInfo'];
            if (typeof addressInfo !== "string") {
                res.status(400).send('Please add addressInfo (type is string, like `ws://localhost:8080`) to the request body.');
                return;
            }

            // 2. Get and check backup
            const backup = req.body["backup"];
            if (typeof backup !== "string") {
                res.status(400).send('Please add backup (type is string) to the request body.');
                return;
            }

            // 3. Get and check password
            const password = req.headers["password"];
            if (typeof password !== "string") {
                res.status(400).send('Please add password (type is string) to the request header.');
                return;
            }

            try {
                res.send(await this.marketService.register(backup, addressInfo, password))
            } catch (error) {
                this.reconnectWS();
                res.send(await this.marketService.register(backup, addressInfo, password));
            }
        })

        router.post('/api/v1/market/sorder', async (req, res, next) => {
            logger.info('request path: ' + '/api/v1/market/sorder' +', request time: ' + moment().format())
            // 1. Get and check storage order
            let sorder = req.body['sorder'];
            if (typeof sorder !== "string") {
                res.status(400).send('Please add storage order (type is string) to the request body.');
                return;
            }
            logger.info(sorder);
            // const params = [sorder.provider, sorder.amount, sorder.fileIdentifier, sorder.fileSize, sorder.duration];
            // 2. Get and check backup
            const backup = req.body["backup"];
            if (typeof backup !== "string") {
                res.status(400).send('Please add backup (type is string) to the request body.');
                return;
            }

            // 3. Get and check password
            const password = req.headers["password"];
            if (typeof password !== "string") {
                res.status(400).send('Please add password (type is string) to the request header.');
                return;
            }
            let storageOrder: StorageOrder = JSON.parse(sorder)
            
            res.send(await this.sorder(backup, storageOrder , password))
            
        });

        router.post('/api/v1/account/transfer', async (req, res, next) => {
            logger.info('request path: ' + '/api/v1/account/transfer' +', request time: ' + moment().format())
            console.log('req.body', req.body)
            const dest = req.body["dest"];
            const amount = req.body["amount"];

            //Get backup
            const backup = req.body["backup"];
            if (typeof backup !== "string") {
                res.status(400).send('Please add backup (type is string) to the request body.');
                return;
            }
            
            //Get password
            const password = req.headers["password"];
            if (typeof password !== "string") {
                res.status(400).send('Please add password (type is string) to the request header.');
                return;
            }

            res.send(await this.transfer(backup, dest, amount, password));
        });

        this.express.use('/', router); 

    }

}

export default new App(process.argv[3] || 'ws://127.0.0.1:9944/').express;