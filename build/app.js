"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bodyParser = __importStar(require("body-parser"));
const api_1 = require("@polkadot/api");
const Endpoint_1 = __importDefault(require("crust-sdk/api/common/Endpoint"));
const BlockService_1 = __importDefault(require("./service/BlockService"));
const TeeService_1 = __importDefault(require("./service/TeeService"));
const MarketService_1 = __importDefault(require("./service/MarketService"));
const AccountService_1 = __importDefault(require("./service/AccountService"));
const RetryHandler_1 = require("./util/RetryHandler");
const ConvertUtil_1 = require("crust-sdk/util/ConvertUtil");
const moment = require('moment');
const winston = require('winston');
const logConfiguration = require('./logconfig');
const logger = winston.createLogger(logConfiguration);
// Creates and configures an ExpressJS web server.
class App {
    //Run configuration methods on the Express instance.
    constructor(crust_chain_endpoint) {
        this.express = express_1.default();
        this.middleware();
        this.routes();
        // this.api = new Endpoint('ws://fzk2.crust.run:7080/').api;
        this.host = crust_chain_endpoint;
        this.initService();
    }
    initService() {
        this.endpoint = new Endpoint_1.default(this.host);
        this.blockService = new BlockService_1.default(this.endpoint);
        this.teeService = new TeeService_1.default(this.endpoint);
        this.marketService = new MarketService_1.default(this.endpoint);
        this.accountService = new AccountService_1.default(this.endpoint);
    }
    reconnectWS() {
        logger.info('ws reconnect');
        this.initService();
        logger.info('ws reconnected at' + moment().format());
    }
    // get function 
    head() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.blockService.head();
        });
    }
    blockHash(blockNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.blockService.blockHash(blockNumber);
        });
    }
    identity(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.teeService.identity(address);
        });
    }
    workReports(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.teeService.workReports(address);
        });
    }
    providers(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.marketService.providers(address);
        });
    }
    storageOrders(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.marketService.storageOrders(address);
        });
    }
    // post function 
    registerIdentity(backup, identity, rootPass) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.teeService.registerIdentity(backup, identity, rootPass);
        });
    }
    reportWorks(backup, workReport, rootPass) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.teeService.reportWorks(backup, workReport, rootPass);
        });
    }
    register(backup, addressInfo, storagePrice, rootPass) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.marketService.register(backup, addressInfo, storagePrice, rootPass);
        });
    }
    placeSorder(backup, storageOrder, rootPass) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield yield this.marketService.sorder(backup, storageOrder, rootPass);
        });
    }
    // Configure Express middleware.
    middleware() {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }
    // Hex string to bytes
    hexStr2Bytes(str) {
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
    bin2String(hexStr) {
        if (hexStr.substring(0, 2) != "0x") {
            return null;
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
    generateUser(backup, password) {
        const user = new api_1.Keyring({ type: 'sr25519' }).addFromJson(JSON.parse(backup));
        user.decodePkcs8(password);
        return user;
    }
    // Configure API endpoints.
    routes() {
        let router = express_1.default.Router();
        router.get('/', (req, res, next) => {
            logger.info('request path:' + '/' + ', request time: ' + moment().format());
            res.json({
                message: 'This is crust api.'
            });
        });
        router.get('/api/v1/block/header', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            logger.info('request path: ' + '/api/v1/block/header' + ', request time: ' + moment().format());
            res.send(yield this.head());
        }));
        router.get('/api/v1/block/hash', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            console.log('this.api', this.api);
            logger.info('request path: ' + '/api/v1/block/hash' + ', request time: ' + moment().format());
            // Get address
            const blockNumber = req.query["blockNumber"];
            if (typeof blockNumber !== "string") {
                res.status(400).send('Please add block number (type is string) to the url query.');
                return;
            }
            // Use api to get block hash by number
            res.send(yield this.blockHash(Number(blockNumber)));
        }));
        router.get('/api/v1/tee/identity', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            logger.info('request path: ' + '/api/v1/tee/identity' + ', request time: ' + moment().format());
            // Get address
            const address = req.query["address"];
            if (typeof address !== "string") {
                res.status(400).send('Please add address (type is string) to the url query.');
                return;
            }
            // Use api to get tee identities
            res.send(yield this.identity(address));
        }));
        router.get('/api/v1/tee/workreport', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            logger.info('request path: ' + '/api/v1/tee/workreport' + ', request time: ' + moment().format());
            // Get address
            const address = req.query["address"];
            if (typeof address !== "string") {
                res.status(400).send('Please add address (type is string) to the url query.');
                return;
            }
            // Use api to get work report
            res.send(yield this.workReports(address));
        }));
        router.get('/api/v1/market/provider', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            logger.info('request path: ' + '/api/v1/market/provider' + ', request time: ' + moment().format());
            // 1. Get address
            const address = req.query["address"];
            if (typeof address !== "string") {
                res.status(400).send('Please add provider\'s address (type is string) to the url query.');
                return;
            }
            // 2. Use api to get provider's info
            const provider = ConvertUtil_1.convertToObj(yield this.providers(address));
            if (provider) {
                provider.address = provider.address && this.bin2String(provider === null || provider === void 0 ? void 0 : provider.address);
            }
            res.send(provider);
        }));
        router.get('/api/v1/market/sorder', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            logger.info('request path: ' + '/api/v1/market/sorder' + ', request time: ' + moment().format());
            // 1. Get order id
            const orderId = req.query["orderId"];
            if (typeof orderId !== "string") {
                res.status(400).send('Please add storage order id (type is string) to the url query.');
                return;
            }
            // 2. Use api to get storage order
            res.send(yield this.storageOrders(orderId));
        }));
        router.post('/api/v1/tee/identity', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            logger.info('request path: ' + '/api/v1/tee/identity' + ', request time: ' + moment().format());
            console.log('req.body', req.body);
            const identity = {
                ias_sig: req.body["ias_sig"],
                ias_cert: req.body["ias_cert"],
                account_id: req.body["account_id"],
                isv_body: req.body["isv_body"],
                pub_key: "0x",
                sig: "0x" + req.body["sig"]
            };
            logger.info(`request param ${identity}, time: ${moment().format()}`);
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
            res.send(yield this.registerIdentity(backup, identity, password));
        }));
        router.post('/api/v1/tee/workreport', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            logger.info('request path: ' + '/api/v1/tee/workreport' + ', request time: ' + moment().format());
            console.log('req.body', req.body);
            const workReport = {
                pub_key: "0x" + req.body["pub_key"],
                block_number: req.body["block_height"],
                block_hash: "0x" + req.body["block_hash"],
                used: 0,
                reserved: req.body["reserved"],
                files: req.body["files"].map((file) => {
                    const rst = ["0x" + file.hash, file.size];
                    return rst;
                }),
                sig: "0x" + req.body["sig"]
            };
            logger.info(`request param ${JSON.stringify(workReport)}, time: ${moment().format()}`);
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
            res.send(yield this.reportWorks(backup, workReport, password));
        }));
        router.post('/api/v1/market/register', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            logger.info('request path: ' + '/api/v1/market/register' + ', request time: ' + moment().format());
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
            res.send(yield this.register(backup, addressInfo, storagePrice, password));
        }));
        router.post('/api/v1/market/sorder', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            logger.info('request path: ' + '/api/v1/market/sorder' + ', request time: ' + moment().format());
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
            let storageOrder = JSON.parse(sorder);
            const sorderRes = ConvertUtil_1.convertToObj(yield this.placeSorder(backup, storageOrder, password));
            if (sorderRes.status == 'success') {
                const providerOrders = ConvertUtil_1.convertToObj(yield this.providers(storageOrder === null || storageOrder === void 0 ? void 0 : storageOrder.provider));
                let order_id = "";
                for (const file_map of providerOrders === null || providerOrders === void 0 ? void 0 : providerOrders.file_map) {
                    if (file_map[0] == (storageOrder === null || storageOrder === void 0 ? void 0 : storageOrder.fileIdentifier)) {
                        order_id = file_map[1][file_map[1].length - 1];
                        console.log('order_id', order_id);
                    }
                }
                sorderRes.order_id = order_id;
            }
            res.send(sorderRes);
        }));
        this.express.use('/', router);
    }
}
__decorate([
    RetryHandler_1.RetryHandler,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], App.prototype, "head", null);
__decorate([
    RetryHandler_1.RetryHandler,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], App.prototype, "blockHash", null);
__decorate([
    RetryHandler_1.RetryHandler,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], App.prototype, "identity", null);
__decorate([
    RetryHandler_1.RetryHandler,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], App.prototype, "workReports", null);
__decorate([
    RetryHandler_1.RetryHandler,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], App.prototype, "providers", null);
__decorate([
    RetryHandler_1.RetryHandler,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], App.prototype, "storageOrders", null);
__decorate([
    RetryHandler_1.RetryHandler,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], App.prototype, "registerIdentity", null);
__decorate([
    RetryHandler_1.RetryHandler,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], App.prototype, "reportWorks", null);
__decorate([
    RetryHandler_1.RetryHandler,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, String]),
    __metadata("design:returntype", Promise)
], App.prototype, "register", null);
__decorate([
    RetryHandler_1.RetryHandler,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], App.prototype, "placeSorder", null);
exports.default = new App(process.argv[3] || 'ws://127.0.0.1:9944/').express;
//# sourceMappingURL=app.js.map