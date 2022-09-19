import fs from 'fs';
import path from 'path';

import {preview, Project, upload} from 'miniprogram-ci';
import {ProjectType} from 'miniprogram-ci/dist/@types/types';
import {IInnerUploadResult} from 'miniprogram-ci/dist/@types/ci/upload';
import {getFormatFileSize, getLastCommitLog, getPackageName} from './util';

import {MiniProgramCI} from "miniprogram-ci/dist/@types/types";
import ICompileSettings = MiniProgramCI.ICompileSettings;

type QrType = 'base64' | 'image' | 'terminal';

type robot =
    | 0
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23
    | 24
    | 25
    | 26
    | 27
    | 28
    | 29
    | 30;

interface Options {
    workspace: string;
    env: string;
    version: string;
    desc: string;
    pkp: string;
    type: ProjectType;
    qr?: QrType;
    qrDest?: string;
    robot: robot;
}

interface ProjectConfig {
    appid: string;
    miniprogramRoot: string;
    setting: ICompileSettings;
    compileType: string;
}

interface UploadOptions {
    proxy?: string;
}

interface PreviewOptions {
    qr: QrType;
    qrDest: string;
    proxy?: string;
    pagePath?: string;
    searchQuery?: string;
}

function fsExistsSync(path: string) {
    try {
        // @ts-ignore
        fs.accessSync(path, fs.F_OK);
    } catch (e) {
        return false;
    }
    return true;
}

export class Ci {
    private version: string;

    public workspace: string = '';

    public project: any | undefined;

    public projectConfig: ProjectConfig | undefined;

    private desc: string;

    private env: string | undefined;

    private robot: robot;

    constructor(opts: Options) {
        const {workspace, type, version, desc, pkp, env, robot} = opts;

        this.workspace = workspace;
        this.version = version;
        this.desc = desc;
        this.env = env;
        this.robot = robot;

        // 加载配置文件
        if (this.loadProjectConfig(path.join(workspace, 'project.config.json')) && this.projectConfig) {
            this.project = new Project({
                appid: this.projectConfig.appid,
                type: type,
                projectPath: workspace,
                privateKeyPath: pkp,
                ignores: ['node_modules/**/*'],
            });
        }
    }

    private loadProjectConfig(configPath: string): boolean {
        if (this.isFileExist(configPath)) {
            try {
                const jsonString = fs.readFileSync(configPath);

                const config = JSON.parse(jsonString.toString());

                this.projectConfig = {
                    appid: config.appid,
                    miniprogramRoot: config.miniprogramRoot,
                    setting: config.setting ? {...config.setting, es7: !!config.setting.enhance} : {},
                    compileType: config.compileType,
                };

                return true;
            } catch (error) {
                console.log('Load file failed');
                console.log(error);
                return false;
            }
        }

        return false;
    }

    private isFileExist(file: string) {
        return fsExistsSync(file);
    }

    public async getTitleFromGit(): Promise<{ version: string; desc: string }> {
        let version = this.version || process.env.npm_package_version || '';
        let desc = this.desc;
        let envDesc = this.env ? `env: ${this.env}` : '';

        if (!version) {
            try {
                const pkg = require(path.resolve(this.workspace, 'package.json'));

                version = pkg.version;
            } catch (error) {
                version = '0.0.0';
                console.error('Load package.json failed');
                console.error(error);
            }
        }

        try {
            const latestCommit = await getLastCommitLog(this.workspace);

            const hash = `(${latestCommit.hash.substring(0, 7)})`;

            if (this.env) {
                version = `${version}.${this.env}`;
            }

            // 没有desc时使用提交信息
            desc = `${envDesc} ${desc || latestCommit.message + hash}`;
        } catch (e) {
            if (this.env) {
                version = `${version}.${this.env}`;
            }

            desc = `${envDesc} ${this.desc}`;
        }

        return {
            version,
            desc,
        };
    }

    public printResult(version: string, desc: string, result: IInnerUploadResult) {
        const {subPackageInfo = [], pluginInfo = [], devPluginId = '无'} = result;

        console.log(`[发布信息]
            时间: ${new Date().toLocaleString()}\n
            版本号: ${version}\n
            项目备注: ${desc}`);

        console.log('[包信息]');
        subPackageInfo.forEach((packageInfo: any) => {
            const formatSize = getFormatFileSize(packageInfo.size);
            console.log(`
            类型: ${getPackageName(packageInfo.name)}\n
            大小: ${formatSize.size + formatSize.measure}
            `);
        });

        if (pluginInfo && pluginInfo.length) {
            console.log('[插件信息]');
            pluginInfo.forEach((pluginInfo: any) => {
                const formatSize = getFormatFileSize(pluginInfo.size);
                console.log(`
                appid: ${pluginInfo.pluginProviderAppid}\n
                版本: ${pluginInfo.version}\n
                大小: ${formatSize.size + formatSize.measure}\n
                devPluginId: ${devPluginId}
                `);
            });
        }
    }

    private relsoveQrPath(qrcodeFormat: QrType | undefined, qrcodeOutputDest: string | undefined): string {
        if (qrcodeFormat === 'base64' || qrcodeFormat === 'image') {
            return path.join(this.workspace, qrcodeOutputDest || 'preview.png');
        }

        return '';
    }

    public async upload(opts: UploadOptions) {
        if (this.project) {
            const info = await this.getTitleFromGit();

            console.log('上传...');

            try {
                const uploadResult = await upload({
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
            } catch (error) {
                console.log('上传失败');

                console.error(error);
                process.exit(1);
            }
        }
    }

    public async preview(opts: PreviewOptions) {
        if (this.project) {
            const info = await this.getTitleFromGit();

            console.log('预览..')

            try {
                const previewResult = await preview({
                    project: this.project,
                    version: info.version,
                    desc: info.desc,
                    setting: this.projectConfig ? this.projectConfig.setting : {},
                    qrcodeFormat: opts.qr,
                    qrcodeOutputDest: this.relsoveQrPath(opts.qr, opts.qrDest),
                    onProgressUpdate: function () {
                    },
                    pagePath: opts.pagePath,
                    searchQuery: opts.searchQuery, // 这里的`&`字符在命令行中应写成转义字符`\&`
                    // @ts-ignore
                    proxy: opts.proxy || '',
                    robot: this.robot,
                });

                console.log('预览成功');

                this.printResult(info.version, info.desc, previewResult);
            } catch (e: any) {
                console.log('预览失败');

                console.error(e.message);

                process.exit(1);
            }
        }
    }
}

