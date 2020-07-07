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
class BlockService {
    constructor(endpoint) {
        this.head = () => __awaiter(this, void 0, void 0, function* () {
            return yield this.block.head();
        });
        this.blockHash = (blockNumber) => __awaiter(this, void 0, void 0, function* () {
            return yield this.block.blockHash(blockNumber);
        });
        this.block = new crust_sdk_1.Block(endpoint);
    }
}
exports.default = BlockService;
//# sourceMappingURL=BlockService.js.map