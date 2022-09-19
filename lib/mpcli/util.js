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
exports.getFormatFileSize = exports.getLastCommitLog = exports.getPackageName = void 0;
function getPackageName(name) {
    if (name === '__FULL__') {
        return '整包';
    }
    else if (name === '__APP__') {
        return '主包';
    }
    else {
        return '分包';
    }
}
exports.getPackageName = getPackageName;
function getLastCommitLog(gitProject) {
    return __awaiter(this, void 0, void 0, function* () {
        return '-';
    });
}
exports.getLastCommitLog = getLastCommitLog;
function getFormatFileSize(bytes) {
    if (bytes === 0) {
        return {
            size: 0,
            measure: 'Bytes',
        };
    }
    bytes *= 1024;
    const K = 1024;
    const MEASURE = ['', 'Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(K));
    return {
        size: parseFloat((bytes / Math.pow(K, i)).toFixed(2)),
        measure: MEASURE[i],
    };
}
exports.getFormatFileSize = getFormatFileSize;
