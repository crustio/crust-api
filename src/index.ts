import express from 'express';
import * as services from './services';
import * as bodyParser from 'body-parser';

const app = express();
const PORT = 56666;

app.use(bodyParser.json());

// Get routes
app.get('/api/v1/block/header', services.block.header);

// Post routes
app.post('/api/v1/swork/identity', services.swork.register);

app.listen(PORT, () => {
    console.log(`⚡️ [server]: crust api is running at https://localhost:${PORT}`);
});