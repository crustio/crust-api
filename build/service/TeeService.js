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
const crust_sdk_1 = require("crust-sdk");
const BaseService_1 = __importDefault(require("./BaseService"));
class TeeService extends BaseService_1.default {
    constructor(endpoint) {
        super(endpoint);
        this.identity = (address) => __awaiter(this, void 0, void 0, function* () {
            return yield this.tee.identity(address);
        });
        this.registerIdentity = (backup, identity, rootPass) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield this.keyringLoad(backup, rootPass);
            return yield this.tee.registerIdentity((_a = JSON.parse(backup)) === null || _a === void 0 ? void 0 : _a.address, identity, rootPass);
        });
        this.reportWorks = (backup, workReport, rootPass) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            yield this.keyringLoad(backup, rootPass);
            return yield this.tee.reportWorks((_b = JSON.parse(backup)) === null || _b === void 0 ? void 0 : _b.address, workReport, rootPass);
        });
        this.workReports = (accountId) => __awaiter(this, void 0, void 0, function* () {
            return yield this.tee.workReports(accountId);
        });
        this.tee = new crust_sdk_1.Tee(endpoint);
    }
}
exports.default = TeeService;
//# sourceMappingURL=TeeService.js.map