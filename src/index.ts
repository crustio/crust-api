import * as http from 'http';
import debug from 'debug';

import app from './app';
const winston = require('winston');
const logConfiguration = require('./logconfig');
const logger = winston.createLogger(logConfiguration);

debug('ts-express:server');

const port = normalizePort(process.argv[2] || 56666);
app.set('port', port);

const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
});
  
function normalizePort(val: number | string): number | string | boolean {
    let port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(port)) return val;
    else if (port >= 0) return port;
    else return false;
}

function onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') throw error;
    let bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            logger.error(`${bind} requires elevated privileges`);
            process.exit(1);
        case 'EADDRINUSE':
            logger.error(`${bind} is already in use`);
            process.exit(1);
        default:
            throw error;
    }
}

function onListening(): void {
    let addr = server.address();
    let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
    debug(`Listening on ${bind}`);
}
