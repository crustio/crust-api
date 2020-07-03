export function RetryHandler(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    //make the method enumerable
    descriptor.enumerable = true;
    const origin = target[propertyKey];
    // aop
    target[propertyKey] = function(...args: any[]) {
        try {
            let result = origin.apply(this, args)
            return result;
        } catch (error) {
            console.log(error)
            target['reconnectWS']();
            let result = origin.apply(this, args)
            return result;
        }
    }
    return target[propertyKey];   
}