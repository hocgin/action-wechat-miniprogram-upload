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
exports.run = void 0;
const uploadapi_1 = require("./uploadapi");
function run(input) {
    return __awaiter(this, void 0, void 0, function* () {
        let preview_qrcode;
        if (input.action_type === 'upload') {
            yield (0, uploadapi_1.upload)(input);
        }
        else if (input.action_type === 'preview') {
            preview_qrcode = yield (0, uploadapi_1.preview)(input);
        }
        else {
            throw new Error(`unSupport action_type ${input.action_type}`);
        }
        return {
            preview_qrcode
        };
    });
}
exports.run = run;
