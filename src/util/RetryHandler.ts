const winston = require('winston');
const logConfiguration = require('../logconfig');
const logger = winston.createLogger(logConfiguration);

export function RetryHandler(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    //make the method enumerable
    descriptor.enumerable = true;
    const origin = target[propertyKey];
    // aop
    target[propertyKey] = async function(...args: any[]) {
        let res = await origin.apply(this, args);
        if ('error' === res.status) {
            logger.error(`reconnected  error: ${JSON.stringify(res.message)}`)
            await target['reconnectWS']();
            res = origin.apply(this, args)
        } 
        return res;
    }
    return target[propertyKey]; 
      
}