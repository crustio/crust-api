import express from 'express';
import {Request, Response} from 'express';
import {logger} from './services';
import * as services from './services';
import * as bodyParser from 'body-parser';

const app = express();
const PORT = 56666;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const error = (err: any, _req: Request, res: Response, _next: any) => {
  logger.error(`☄️ [global]: error catched ${err.message}`);
  res.status(500).send({
    status: 'error',
    message: err.message,
  });
  services.api.registerTypes(services.types);
  logger.warn('📡 [global]: connection reinitialized.');
};

app.use(bodyParser.json());

// Get routes
app.get('/api/v1/block/header', services.chain.header);
app.get('/api/v1/block/hash', services.chain.blockHash);
app.get('/api/v1/system/health', services.chain.health);
app.get('/api/v1/swork/workreport', services.swork.workReport);
app.get('/api/v1/swork/code', services.swork.code);
app.get('/api/v1/swork/identity', services.swork.identity);

// Post routes
app.post('/api/v1/swork/identity', services.swork.register);
app.post('/api/v1/swork/workreport', services.swork.reportWorks);

// Error handler
app.use(error);

app.listen(PORT, () => {
  logger.info(
    `⚡️ [global]: crust api is running at https://localhost:${PORT}`
  );
});
