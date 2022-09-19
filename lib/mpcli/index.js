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
exports.Ci = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ci = require('miniprogram-ci');
let { preview, Project, upload } = ci;
const util_1 = require("./util");
function fsExistsSync(path) {
    try {
        // @ts-ignore
        fs_1.default.accessSync(path, fs_1.default.F_OK);
    }
    catch (e) {
        return false;
    }
    return true;
}
class Ci {
    constructor(opts) {
        this.workspace = '';
        const { workspace, type, version, desc, pkp, env, robot } = opts;
        this.workspace = workspace;
        this.version = version;
        this.desc = desc;
        this.env = env;
        this.robot = robot;
        // 加载配置文件
        if (this.loadProjectConfig(path_1.default.join(workspace, 'project.config.json')) && this.projectConfig) {
            this.project = new Project({
                appid: this.projectConfig.appid,
                type: type,
                projectPath: workspace,
                privateKeyPath: pkp,
                ignores: ['node_modules/**/*'],
            });
        }
    }
    loadProjectConfig(configPath) {
        if (this.isFileExist(configPath)) {
            try {
                const jsonString = fs_1.default.readFileSync(configPath);
                const config = JSON.parse(jsonString.toString());
                this.projectConfig = {
                    appid: config.appid,
                    miniprogramRoot: config.miniprogramRoot,
                    setting: config.setting ? Object.assign(Object.assign({}, config.setting), { es7: !!config.setting.enhance }) : {},
                    compileType: config.compileType,
                };
                return true;
            }
            catch (error) {
                console.log('Load file failed');
                console.log(error);
                return false;
            }
        }
        return false;
    }
    isFileExist(file) {
        return fsExistsSync(file);
    }
    getTitleFromGit() {
        return __awaiter(this, void 0, void 0, function* () {
            let version = this.version || process.env.npm_package_version || '';
            let desc = this.desc;
            let envDesc = this.env ? `env: ${this.env}` : '';
            if (!version) {
                try {
                    const pkg = require(path_1.default.resolve(this.workspace, 'package.json'));
                    version = pkg.version;
                }
                catch (error) {
                    version = '0.0.0';
                    console.error('Load package.json failed');
                    console.error(error);
                }
            }
            try {
                const latestCommit = yield (0, util_1.getLastCommitLog)(this.workspace);
                const hash = `(${latestCommit.hash.substring(0, 7)})`;
                if (this.env) {
                    version = `${version}.${this.env}`;
                }
                // 没有desc时使用提交信息
                desc = `${envDesc} ${desc || latestCommit.message + hash}`;
            }
            catch (e) {
                if (this.env) {
                    version = `${version}.${this.env}`;
                }
                desc = `${envDesc} ${this.desc}`;
            }
            return {
                version,
                desc,
            };
        });
    }
    printResult(version, desc, result) {
        const { subPackageInfo = [], pluginInfo = [], devPluginId = '无' } = result;
        console.log(`[发布信息]
            时间: ${new Date().toLocaleString()}\n
            版本号: ${version}\n
            项目备注: ${desc}`);
        console.log('[包信息]');
        subPackageInfo.forEach((packageInfo) => {
            const formatSize = (0, util_1.getFormatFileSize)(packageInfo.size);
            console.log(`
            类型: ${(0, util_1.getPackageName)(packageInfo.name)}\n
            大小: ${formatSize.size + formatSize.measure}
            `);
        });
        if (pluginInfo && pluginInfo.length) {
            console.log('[插件信息]');
            pluginInfo.forEach((pluginInfo) => {
                const formatSize = (0, util_1.getFormatFileSize)(pluginInfo.size);
                console.log(`
                appid: ${pluginInfo.pluginProviderAppid}\n
                版本: ${pluginInfo.version}\n
                大小: ${formatSize.size + formatSize.measure}\n
                devPluginId: ${devPluginId}
                `);
            });
        }
    }
    relsoveQrPath(qrcodeFormat, qrcodeOutputDest) {
        if (qrcodeFormat === 'base64' || qrcodeFormat === 'image') {
            return path_1.default.join(this.workspace, qrcodeOutputDest || 'preview.png');
        }
        return '';
    }
    upload(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.project) {
                const info = yield this.getTitleFromGit();
                console.log('上传...');
                try {
                    const uploadResult = yield upload({
                        project: this.project,
                        version: info.version,
                        desc: info.desc,
                        setting: this.projectConfig ? this.projectConfig.setting : {},
                        onProgressUpdate: function () {
                        },
                        // @ts-ignore
                        proxy: opts.proxy || '',
                        robot: this.robot,
                    });
                    console.log('上传成功');
                    this.printResult(info.version, info.desc, uploadResult);
                }
                catch (error) {
                    console.log('上传失败');
                    console.error(error);
                    process.exit(1);
                }
            }
        });
    }
    preview(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.project) {
                const info = yield this.getTitleFromGit();
                console.log('预览..');
                try {
                    const previewResult = yield preview({
                        project: this.project,
                        version: info.version,
                        desc: info.desc,
                        setting: this.projectConfig ? this.projectConfig.setting : {},
                        qrcodeFormat: opts.qr,
                        qrcodeOutputDest: this.relsoveQrPath(opts.qr, opts.qrDest),
                        onProgressUpdate: function () {
                        },
                        pagePath: opts.pagePath,
                        searchQuery: opts.searchQuery,
                        // @ts-ignore
                        proxy: opts.proxy || '',
                        robot: this.robot,
                    });
                    console.log('预览成功');
                    this.printResult(info.version, info.desc, previewResult);
                }
                catch (e) {
                    console.log('预览失败');
                    console.error(e.message);
                    process.exit(1);
                }
            }
        });
    }
}
exports.Ci = Ci;
