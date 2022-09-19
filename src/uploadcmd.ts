import {Inputs} from "./main";
import fs from "fs";
import path from "path";
import * as exec from "@actions/exec";


export async function upload(input: Inputs, options: any) {
    let keyfile = toKeyFile(input.upload_key);
    let args = [
        `--pkp ${keyfile}`,
        `--type ${input.type}`
    ];
    if (input.env) {
        args.push(`--env ${input.env}`);
    }
    if (input.version) {
        args.push(`--ver ${input.version}`);
    }
    if (input.description) {
        args.push(`--desc ${input.description}`);
    }
    if (input.proxy) {
        args.push(`--proxy ${input.proxy}`);
    }
    await exec.exec('mp-ci', ['upload', ...args], options);
}

export async function preview(input: Inputs, options: any) {
    let png = 'preview.png';
    let keyfile = toKeyFile(input.upload_key);
    let args = [
        `--pkp ${keyfile}`,
        `--qr base64`,
        `--qrDest ${png}`,
        `--type ${input.type}`
    ];
    if (input.env) {
        args.push(`--env ${input.env}`);
    }
    if (input.version) {
        args.push(`--ver ${input.version}`);
    }
    if (input.description) {
        args.push(`--desc ${input.description}`);
    }
    if (input.preview_pagepath) {
        args.push(`--pagePath ${input.preview_pagepath}`);
    }
    if (input.preview_pagequery) {
        args.push(`--searchQuery ${input.preview_pagequery}`);
    }
    if (input.proxy) {
        args.push(`--proxy ${input.proxy}`);
    }

    await exec.exec('mp-ci', ['preview', ...args], options);
    return String(fs.readFileSync(path.join(input.workspace, png)));
}

function toKeyFile(keydata: string) {
    let path = 'uploadkey.key';
    fs.writeFileSync(path, keydata);
    return path;
}
