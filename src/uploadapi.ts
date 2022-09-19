import {Inputs} from "./main";
import fs from "fs";

const Ci = require('mp-ci/lib');
import path from "path";


export async function createCi(input: Inputs) {
    let keyfile = toKeyFile(input.upload_key);
    return new Ci({
        workspace: input.workspace,
        env: input.env,
        version: input.version,
        desc: `${input.description}`,
        type: input.type,
        pkp: keyfile,
        robot: 1,
    });
}

export async function upload(input: Inputs) {
    let ci = await createCi(input);
    return await ci.upload({proxy: input.proxy});
}

export async function preview(input: Inputs) {
    let png = 'preview.png';
    let ci = await createCi(input);
    await ci.preview({
        qr: 'base64',
        qrDest: png,
        pagePath: input.preview_pagepath,
        searchQuery: input.preview_pagequery,
        proxy: input.proxy,
    });
    return String(fs.readFileSync(path.join(input.workspace, png)));
}

function toKeyFile(keydata: string) {
    let path = 'uploadkey.key';
    fs.writeFileSync(path, keydata);
    return path;
}
