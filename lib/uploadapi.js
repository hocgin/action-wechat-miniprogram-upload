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
exports.preview = exports.upload = exports.createCi = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const mpcli_1 = require("./mpcli");
function createCi(input) {
    return __awaiter(this, void 0, void 0, function* () {
        let keyfile = toKeyFile(input.upload_key);
        return new mpcli_1.Ci({
            workspace: input.workspace,
            env: input.env,
            version: input.version,
            desc: `${input.description}`,
            type: input.type,
            pkp: keyfile,
            robot: 1,
        });
    });
}
exports.createCi = createCi;
function upload(input) {
    return __awaiter(this, void 0, void 0, function* () {
        let ci = yield createCi(input);
        return yield ci.upload({ proxy: input.proxy });
    });
}
exports.upload = upload;
function preview(input) {
    return __awaiter(this, void 0, void 0, function* () {
        let png = 'preview.png';
        let ci = yield createCi(input);
        yield ci.preview({
            qr: 'base64',
            qrDest: png,
            pagePath: input.preview_pagepath,
            searchQuery: input.preview_pagequery,
            proxy: input.proxy,
        });
        return String(fs_1.default.readFileSync(path_1.default.join(input.workspace, png)));
    });
}
exports.preview = preview;
function toKeyFile(keydata) {
    let path = 'uploadkey.key';
    fs_1.default.writeFileSync(path, keydata);
    return path;
}
