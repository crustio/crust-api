import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';



// Creates and configures an ExpressJS web server.
class App {

    // ref to Express instance
    public express: express.Application;
    api: Promise<ApiPromise>;

    //Run configuration methods on the Express instance.
    constructor(crust_chain_endpoint: string) {
        this.express = express();
        this.middleware();
        this.routes();
        this.api = ApiPromise.create({
            provider: new WsProvider(crust_chain_endpoint),
            types: {
                Identity: {
                    "pub_key": "Vec<u8>",
                    "account_id": "AccountId",
                    "validator_pub_key": "Vec<u8>",
                    "validator_account_id": "AccountId",
                    "sig": "Vec<u8>"
                },
                WorkReport: {
                    "pub_key": "Vec<u8>",
                    "block_height": "u64",
                    "block_hash": "Vec<u8>",
                    "empty_root": "Vec<u8>",
                    "empty_workload": "u128",
                    "meaningful_workload": "u128",
                    "sig": "Vec<u8>"
                }
            }
        });
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }

    // Hex string to bytes
    private hexStr2Bytes(str: string) {
        var pos = 0;
        var len = str.length;
        if (len % 2 != 0) {
            return null;
        }
    
        len /= 2;
        var hexA = new Array();
        for (var i = 0; i < len; i++) {
            var s = str.substr(pos, 2);
            var v = parseInt(s, 16);
            hexA.push(v);
            pos += 2;
        }
    
        return hexA;
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
            res.json({
                message: 'This is crust api.'
            });
        });

        router.get('/api/v1/block/header', (req, res, next) => {
            this.api.then(async (api) => {
                const lastHeader = await api.rpc.chain.getHeader();
                res.json({
                    number: lastHeader.number,
                    hash: lastHeader.hash,
                });
            }).catch(e => {
                res.status(500).send(`${e}`);
                return;
            });
        });

        router.get('/api/v1/tee/identity', (req, res, next) => {
            // Get address
            const address = req.query["address"];
            if (typeof address !== "string") {
                res.status(400).send('Please add address (type is string) to the url query.');
                return;
            }

            // Use api to get tee identities
            this.api.then(async (api) => {
                const identity = await api.query.tee.teeIdentities(address);
                res.json(identity);
            }).catch(e => {
                res.status(500).send(`${e}`);
                return;
            });
        });

        router.get('/api/v1/tee/workreport', (req, res, next) => {
            // Get address
            const address = req.query["address"];
            if (typeof address !== "string") {
                res.status(400).send('Please add address (type is string) to the url query.');
                return;
            }

            // Use api to get work report
            this.api.then(async (api) => {
                const workReport = await api.query.tee.workReports(address);
                res.json(workReport);
            }).catch(e => {
                res.status(500).send(`${e}`);
                return;
            });
        });

        router.post('/api/v1/tee/identity', (req, res, next) => {
            //Get identity
            const identity = req.body['identity'];
            if (typeof identity !== "string") {
                res.status(400).send('Please add identity (type is string) to the request body.');
                return;
            }

            const identityjson = JSON.parse(identity.toString());

            const identityInstance = {
                pub_key: this.hexStr2Bytes(identityjson["pub_key"]),
                account_id: identityjson["account_id"],
                validator_pub_key: this.hexStr2Bytes(identityjson["validator_pub_key"]),
                validator_account_id: identityjson["validator_account_id"],
                sig: this.hexStr2Bytes(identityjson["sig"])
            }

            console.log(identityInstance);

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

            // Generate user
            let user: KeyringPair;
            try {
                user = this.generateUser(backup, password);
            } catch (e) {
                res.status(400).send(`Please add right backup and password. ${e}`);
                return;
            }

            // Use api to store tee identity
            const params = [identityInstance];
            let isFillRes = false;
            this.api.then(async (api) => {
                api.tx.tee.registerIdentity(...params).signAndSend(user, ({ status }) => {
                    status.isFinalized
                        ? console.log(`Completed at block hash #${status.asFinalized.toString()}`)
                        : console.log(`Current transaction status: ${status.type}`);
                    if (!isFillRes) {
                        res.json({
                            message: 'Try to save tee identity to crust chain.'
                        });
                        isFillRes = true;
                    }
                }).catch(e => {
                    res.status(500).send(`${e}`);
                    return;
                });
            }).catch(e => {
                res.status(500).send(`${e}`);
                return;
            });
        });

        router.post('/api/v1/tee/workreport', (req, res, next) => {
            //Get workreport
            const workReport = req.body['workreport'];
            if (typeof workReport !== "string") {
                res.status(400).send('Please add workreport (type is string) to the request body.');
                return;
            }

            const workReportJson = JSON.parse(workReport.toString());

            const workReportInstance = {
                pub_key: this.hexStr2Bytes(workReportJson["pub_key"]),
                block_height: workReportJson["block_height"],
                block_hash: this.hexStr2Bytes(workReportJson["block_hash"]),
                empty_root: this.hexStr2Bytes(workReportJson["empty_root"]),
                empty_workload: workReportJson["empty_workload"],
                meaningful_workload: workReportJson["meaningful_workload"],
                sig: this.hexStr2Bytes(workReportJson["sig"])
            }

            console.log(workReportInstance);

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

            // Generate user
            let user: KeyringPair;
            try {
                user = this.generateUser(backup, password);
            } catch (e) {
                res.status(400).send(`Please add right backup and password. ${e}`);
                return;
            }

            // Use api to store tee work report
            const params = [workReportInstance];
            let isFillRes = false;
            this.api.then(async (api) => {
                api.tx.tee.reportWorks(...params).signAndSend(user, ({ status }) => {
                    status.isFinalized
                        ? console.log(`Completed at block hash #${status.asFinalized.toString()}`)
                        : console.log(`Current transaction status: ${status.type}`);
                    if (!isFillRes) {
                        res.json({
                            message: 'Try to save tee work report to crust chain.'
                        });
                        isFillRes = true;
                    }
                }).catch(e => {
                    res.status(500).send(`${e}`);
                    return;
                });
            }).catch(e => {
                res.status(500).send(`${e}`);
                return;
            });
        });

        this.express.use('/', router);
    }
}

export default new App(process.argv[3] || 'ws://127.0.0.1:9944/').express;