import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/api';
import keyring2 from '@polkadot/ui-keyring';
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
        this.api = ApiPromise.create({ provider: new WsProvider(crust_chain_endpoint) });;
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }

    // Hex string to string
    private hexstring2string(hex: string) {
        var str = '';
        for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str;
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
                const identities = await api.query.tee.teeIdentities(address);
                res.json({
                    identity: this.hexstring2string(identities.toString().slice(2)),
                });
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
                const identities = await api.query.tee.workReports(address);
                res.json({
                    workreport: this.hexstring2string(identities.toString().slice(2)),
                });
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
            const params = [`${identity}`];
            let isFillRes = false;
            this.api.then(async (api) => {
                api.tx.tee.storeTeeIdentity(...params).signAndSend(user, ({ status }) => {
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
            const workreport = req.body['workreport'];
            if (typeof workreport !== "string") {
                res.status(400).send('Please add workreport (type is string) to the request body.');
                return;
            }

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
            const params = [`${workreport}`];
            let isFillRes = false;
            this.api.then(async (api) => {
                api.tx.tee.storeWorkReport(...params).signAndSend(user, ({ status }) => {
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

export default new App(process.env.CRUST_CHAIN_ENDPOINT || 'ws://127.0.0.1:9944/').express;