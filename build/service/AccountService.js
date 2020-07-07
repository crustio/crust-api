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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseService_1 = __importDefault(require("./BaseService"));
class AccountService extends BaseService_1.default {
    constructor(endpoint) {
        super(endpoint);
    }
    transfer(backup, dest, amount, rootPass) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield this.keyringLoad(backup, rootPass);
            return yield this.account.transfer((_a = JSON.parse(backup)) === null || _a === void 0 ? void 0 : _a.address, dest, amount, rootPass);
        });
    }
}
exports.default = AccountService;
//# sourceMappingURL=AccountService.js.map