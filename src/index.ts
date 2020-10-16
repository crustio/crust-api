import express from 'express';
import { Request, Response,  } from 'express';
import * as services from './services';
import * as bodyParser from 'body-parser';

const app = express();
const PORT = 56666;

const error = (err: any, _req: Request, res: Response, _next: any) => {
    console.error("hahaha", err.stack);
  
    res.status(500).send('Internal Server Error');
}

app.use(bodyParser.json());

// Get routes
app.get('/api/v1/block/header', services.block.header);

// Post routes
app.post('/api/v1/swork/identity', services.swork.register);

// Error handler
app.use(error);

app.listen(PORT, () => {
    console.log(`⚡️ [server]: crust api is running at https://localhost:${PORT}`);
});