import express from 'express';
import * as bodyParser from 'body-parser';
import { ApiPromise } from '@polkadot/api';
import { Keyring } from '@polkadot/api';
import Endpoint from 'crust-sdk/api/common/Endpoint';
import BlockService from './service/BlockService';
import SworkService from './service/SworkService';
import MarketService from './service/MarketService';
import AccountService from './service/AccountService';
import { StorageOrder } from 'crust-sdk/api/Market';
import { RetryHandler } from './util/RetryHandler';
import { convertToObj } from "crust-sdk/util/ConvertUtil";

const _ = require('express-async-errors');
const moment = require('moment');
const winston = require('winston');
const logConfiguration = require('./logconfig');
const logger = winston.createLogger(logConfiguration);

// Creates and configures an ExpressJS web server.
class App {

    // ref to Express instance
    public express: express.Application;
    api: Promise<ApiPromise>;

    static host: string;

    static endpoint: Endpoint;

    blockService: BlockService;
    sworkService: SworkService;
    marketService: MarketService;
    accountService: AccountService;
    //Run configuration methods on the Express instance.
    constructor(crust_chain_endpoint: string) {
        this.express = express();
        this.middleware();
        this.routes();
        // this.api = new Endpoint('ws://fzk2.crust.run:7080/').api;
        App.host = crust_chain_endpoint;
        this.initService();
    }
    
    private initService() {
        App.endpoint = new Endpoint(App.host);
        this.blockService = new BlockService(App.endpoint);
        this.sworkService = new SworkService(App.endpoint);
        this.marketService = new MarketService(App.endpoint);
        this.accountService = new AccountService(App.endpoint);
    }

    reconnectWS() {
        logger.info('ws reconnect')
        this.initService();
        logger.info('ws reconnected at' + moment().format())
    }

    // get function 
    @RetryHandler
    async head() {
        return await this.blockService.head()
    }

    @RetryHandler
    async blockHash(blockNumber: number) {
        return await this.blockService.blockHash(blockNumber)
    }

    @RetryHandler
    async identity(address: string) {
        return await this.sworkService.identity(address);
    }

    @RetryHandler
    async code() {
        return await this.sworkService.code()
    }

    @RetryHandler
    async workReports(address: string) {
        return await this.sworkService.workReports(address);
    }

    @RetryHandler
    async systemHealth() {
        return await this.blockService.systemHealth();
    }

    @RetryHandler
    async merchants(address: string) {
        return await this.marketService.merchants(address);
    }

    @RetryHandler
    async storageOrders(address: string) {
        return await this.marketService.storageOrders(address);
    }

    // post function 
    @RetryHandler
    async registerIdentity(backup: string, identity: any, rootPass: string) {
        return await this.sworkService.registerIdentity(backup, identity, rootPass);
    }

    @RetryHandler
    async reportWorks(backup: string, workReport: any, rootPass: string) {
        return await this.sworkService.reportWorks(backup, workReport, rootPass);
    }

    @RetryHandler
    async register(backup: string, addressInfo: string, storagePrice: number, rootPass: string) {
        return await this.marketService.register(backup, addressInfo, storagePrice, rootPass);
    }

    @RetryHandler
    async placeSorder(backup: string, storageOrder: StorageOrder, rootPass: string) {
        return await this.marketService.sorder(backup, storageOrder , rootPass);
    }

    @RetryHandler
    async transferCandy(backup: string, dest: string, amount: number, rootPass: string) {
        return await this.accountService.transferCandy(backup, dest, amount, rootPass);
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
            res.status(200).send({
                message: 'This is crust api.'
            });
        });

        router.get('/api/v1/block/header', async (req, res, next) => {
            logger.info('request path: ' + '/api/v1/block/header' +', request time: ' + moment().format())
            const head = convertToObj(await this.head());
            logger.info(`block header res: ${JSON.stringify(head)}`);
            if (head) {
                res.send(head);
            } else {
                res.status(404).send(head);
            }
        });

        router.get('/api/v1/block/hash',async (req, res, next) => {
            logger.info('request path: ' + '/api/v1/block/hash' +', request time: ' + moment().format())
            // Get address
            const blockNumber = req.query["blockNumber"];
            if (typeof blockNumber !== "string") {
                res.status(400).send('Please add block number (type is string) to the url query.');
                return;
            }

            const result = await this.blockHash(Number(blockNumber));
            // Use api to get block hash by number
            logger.info(`block hash res: ${result.toJSON()}`);
            res.send(result);
        });

        router.get('/api/v1/swork/identity', async (req, res, next) => {
            logger.info('request path: ' + '/api/v1/swork/identity' +', request time: ' + moment().format())
            // Get address
            const address = req.query["address"];
            if (typeof address !== "string") {
                res.status(400).send('Please add address (type is string) to the url query.');
                return;
            }
            // Use api to get swork identities
            const identity = convertToObj(await this.identity(address));
            if (identity) {
                res.send(identity);
            } else {
                res.status(404).send(identity);
            }
        });

        router.get('/api/v1/swork/code', async (req, res, next) => {
            const code = await this.code();
            res.send(code);
        });

        router.get('/api/v1/swork/workreport', async (req, res, next) => {
            logger.info('request path: ' + '/api/v1/swork/workreport' +', request time: ' + moment().format())
            // Get address
            const address = req.query["address"];
            if (typeof address !== "string") {
                res.status(400).send('Please add address (type is string) to the url query.');
                return;
            }
            // Use api to get work report
            const workReport = convertToObj(await this.workReports(address));
            if (workReport) {
                res.send(workReport);
            } else {
                res.status(404).send(workReport);
            }
        });

        router.get('/api/v1/system/health', async (req, res, next) => {
            const systemHealth = convertToObj(await this.systemHealth())
            if (systemHealth) {
                res.send(systemHealth);
            } else {
                res.status(404).send(systemHealth);
            }
        });

        router.get('/api/v1/market/merchant', async (req, res, next) => {
            logger.info('request path: ' + '/api/v1/market/merchant' +', request time: ' + moment().format())
            // 1. Get address
            const address = req.query["address"];
            if (typeof address !== "string") {
                res.status(400).send('Please add merchant\'s address (type is string) to the url query.');
                return;
            }

            // 2. Use api to get merchant's info
            const merchant = convertToObj(await this.merchants(address));
            if (merchant) {
                let file_map_temp = merchant.file_map
                merchant.file_map = new Map()
                if (file_map_temp) {
                    for (let fi of file_map_temp) {
                        merchant.file_map[fi[0]] = fi[1]
                    }
                }

                merchant.address = merchant.address && this.bin2String(merchant?.address);
                res.send(merchant);
            } else {
                res.status(404).send(merchant);
            }
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
            const storageOrders = convertToObj(await this.storageOrders(orderId));
            if (storageOrders) {
                res.send(storageOrders);
            } else {
                res.status(404).send(storageOrders);
            }
        });

        router.post('/api/transfer', async (req, res, next) => {
            console.log('req.body', req.body)
            res.send(req.body);
        });

        router.post('/api/v1/swork/identity', async (req, res, next) => {
            logger.info('request path: ' + '/api/v1/swork/identity' +', request time: ' + moment().format())
            console.log('req.body', req.body)
            const identity = {
                ias_sig: req.body["ias_sig"],
                ias_cert: req.body["ias_cert"],
                account_id: req.body["account_id"],
                isv_body: req.body["isv_body"],
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

            const registerIdentityRes = convertToObj(await this.registerIdentity(backup, identity, password));
            if ('success' == registerIdentityRes.status) {
                res.send(registerIdentityRes);
            } else {
                res.status(400).send(registerIdentityRes);
            }            
            
        });

        router.post('/api/v1/swork/workreport', async (req, res, next) => {
            logger.info('request path: ' + '/api/v1/swork/workreport' +', request time: ' + moment().format())
            console.log('req.body', req.body)
            const workReport = {
                pub_key: "0x" + req.body["pub_key"],
                block_number: req.body["block_height"],
                block_hash: "0x" + req.body["block_hash"],
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
            
            const reportWorksRes = convertToObj(await this.reportWorks(backup, workReport, password));
            if ('success' == reportWorksRes.status) {
                res.send(reportWorksRes);
            } else {
                res.status(400).send(reportWorksRes)
            }
            
        });

        router.post('/api/v1/market/register', async (req, res, next) => {
            logger.info('request path: ' + '/api/v1/market/register' +', request time: ' + moment().format())
            // 1. Get and check address info
            const addressInfo = req.body['addressInfo'];
            if (typeof addressInfo !== "string") {
                res.status(400).send('Please add addressInfo (type is string, like `ws://localhost:8080`) to the request body.');
                return;
            }

            // 2. Get and check storage price
            const storagePrice = req.body['storagePrice'];
            if (typeof storagePrice !== "number") {
                res.status(400).send('Please add storage (type is number, like `40`) to the request body.');
                return;
            }

            // 3. Get and check backup
            const backup = req.body["backup"];
            if (typeof backup !== "string") {
                res.status(400).send('Please add backup (type is string) to the request body.');
                return;
            }

            // 4. Get and check password
            const password = req.headers["password"];
            if (typeof password !== "string") {
                res.status(400).send('Please add password (type is string) to the request header.');
                return;
            }

            const registerRes = convertToObj(await this.register(backup, addressInfo, storagePrice, password));
            if ('success' == registerRes.status) {
                res.send(registerRes);
            } else {
                res.status(400).send(registerRes)
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

            const sorderRes =  convertToObj(await this.placeSorder(backup, storageOrder , password));
            if ('success' == sorderRes.status) {
                const merchantOrders = convertToObj(await this.merchants(storageOrder?.merchant));
                let order_id = "";
                for (const file_map of merchantOrders?.file_map) {
                    if (file_map[0] == storageOrder?.fileIdentifier) {
                        order_id = file_map[1][file_map[1].length - 1]
                        console.log('order_id', order_id)
                    }
                }
                sorderRes.order_id = order_id;
                res.send(sorderRes);
            } else {
                res.status(400).send(sorderRes)
            }

        });

        router.post('/api/v1/candy/transfer', async (req, res, next) => {
            logger.info('request path: ' + '/api/v1/candy/transfer' +', request time: ' + moment().format())
            console.log('req.body', req.body)
            const transfer = {
                dest: req.body["dest"],
                amount: req.body["amount"],
            }
            logger.info(`request param ${JSON.stringify(transfer)}, time: ${moment().format()}`)

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
            
            const transferRes = convertToObj(await this.transferCandy(backup, transfer.dest, transfer.amount, password));
            if ('success' == transferRes.status) {
                res.send(transferRes);
            } else {
                res.status(400).send(transferRes)
            }
            
        });

        this.express.use('/', router); 

        // global error handler
        this.express.use((err: any, req: any, res: any, next: any) => {
            if (err) {
                if (!err.isTrusted) {
                    this.reconnectWS();
                    res.status(500).send({
                        status: 'error',
                        message: 'wait for chain start'
                    })
                } else {
                    res.status(400).send({
                        status: 'failed',
                        message: err
                    })
                }
            }
            next(err);
        });

    }

}

export default new App(process.argv[3] || 'ws://127.0.0.1:9944/').express;