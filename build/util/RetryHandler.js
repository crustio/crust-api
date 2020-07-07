"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetryHandler = void 0;
function RetryHandler(target, propertyKey, descriptor) {
    //make the method enumerable
    descriptor.enumerable = true;
    const origin = target[propertyKey];
    // aop
    target[propertyKey] = function (...args) {
        try {
            let result = origin.apply(this, args);
            return result;
        }
        catch (error) {
            console.log(error);
            target['reconnectWS']();
            let result = origin.apply(this, args);
            return result;
        }
    };
    return target[propertyKey];
}
exports.RetryHandler = RetryHandler;
//# sourceMappingURL=RetryHandler.js.map