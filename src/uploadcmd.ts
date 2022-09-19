import {Inputs} from "./main";
import fs from "fs";
import path from "path";
import * as exec from "@actions/exec";


export async function upload(input: Inputs, options: any) {
    let keyfile = toKeyFile(input.upload_key);
    await exec.exec('mp-ci', ['upload',
        `--env ${input.env}`,
        `--ver ${input.version}`,
        `--desc ${input.description}`,
        `--pkp ${keyfile}`,
        `--proxy ${input.proxy}`,
        `--type ${input.type}`
    ], options);
}

export async function preview(input: Inputs, options: any) {
    let png = 'preview.png';
    let keyfile = toKeyFile(input.upload_key);
    await exec.exec('mp-ci', ['preview',
        `--env ${input.env}`,
        `--ver ${input.version}`,
        `--desc ${input.description}`,
        `--pkp ${keyfile}`,
        `--qr base64`,
        `--qrDest ${png}`,
        `--pagePath ${input.preview_pagepath}`,
        `--searchQuery ${input.preview_pagequery}`,
        `--proxy ${input.proxy}`,
        `--type ${input.type}`
    ], options);
    return String(fs.readFileSync(path.join(input.workspace, png)));
}

function toKeyFile(keydata: string) {
    let path = 'uploadkey.key';
    fs.writeFileSync(path, keydata);
    return path;
}
