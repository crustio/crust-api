"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const crust_sdk_1 = require("crust-sdk");
class BaseService {
    constructor(endpoint) {
        this.account = new crust_sdk_1.Account(endpoint);
    }
    keyringLoad(backup, rootPass) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.account.keyringLoadAll();
                yield this.account.restoreAccount(JSON.parse(backup), rootPass);
            }
            catch (error) {
                console.log('keyring has being loaded ...');
                yield this.account.restoreAccount(JSON.parse(backup), rootPass);
            }
        });
    }
}
exports.default = BaseService;
//# sourceMappingURL=BaseService.js.map