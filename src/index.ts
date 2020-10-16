import express from 'express';
import { Request, Response } from 'express';
import * as services from './services';
import * as bodyParser from 'body-parser';

const app = express();
const PORT = 56666;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const error = (err: any, _req: Request, res: Response, _next: any) => {
  res.status(500).send({
    status: 'error',
    message: err.message,
  });
  services.api.registerTypes(services.types);
  console.log('type has being registered');
};

app.use(bodyParser.json());

// Get routes
app.get('/api/v1/block/header', services.block.header);

// Post routes
app.post('/api/v1/swork/identity', services.swork.register);

app.post('/api/v1/swork/workreport', services.swork.reportWorks);

app.get('/api/v1/swork/workreport', services.swork.workReport);

app.get('/api/v1/swork/code', services.swork.code);

app.get('/api/v1/swork/identity', services.swork.identity);

// Error handler
app.use(error);

app.listen(PORT, () => {
  console.log(
    `⚡️ [server]: crust api is running at https://localhost:${PORT}`
  );
});
