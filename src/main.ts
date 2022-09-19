import {run} from "./core";
import * as core from "@actions/core";

export interface Inputs {
    debug?: boolean;
    upload_key: string;
    workspace: string;
    action_type?: 'upload' | 'preview';
    type: 'miniProgram' | 'miniGame' | 'miniProgramPlugin' | 'miniGamePlugin';
    env: string;
    version: string;
    description?: string;
    preview_pagepath?: string;
    preview_pagequery?: string;
    proxy?: string;
}

export interface Outputs {
    preview_qrcode?: string;

    [key: string]: any
}

let getInput = (): Inputs => ({
    debug: core.getInput('debug') === 'true',
    upload_key: core.getInput('upload_key'),
    workspace: core.getInput('workspace'),
    action_type: core.getInput('action_type') as any,
    type: core.getInput('type') as any,
    env: core.getInput('env') as any,
    version: core.getInput('version') as any,
    description: core.getInput('description') as any,
    preview_pagepath: core.getInput('preview_pagepath') as any,
    preview_pagequery: core.getInput('preview_pagequery') as any,
    proxy: core.getInput('proxy') as any,
})

let handleOutput = (output: Outputs = {}) => {
    Object.keys(output).forEach((key) => core.setOutput(key, output[key]));
    debugPrintf('输出变量: ', output);
};

export function debugPrintf(...args: any) {
    if (getInput().debug) {
        console.log(...args);
    }
}

try {
    (async () => handleOutput(await run(getInput())))();
} catch (error: any) {
    core.setFailed(error?.message);
}

