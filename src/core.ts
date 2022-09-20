import {Inputs, Outputs} from "./main";
import {upload, preview} from "./uploadcmd";

export async function run(input: Inputs): Promise<Outputs> {
    const options: any = {};
    options.listeners = {
        stdout: (data: Buffer) => {
            console.log('stdout', data.toString());
        },
        stderr: (data: Buffer) => {
            console.error(data.toString());
        }
    };
    let preview_qrcode;
    if (input.action_type === 'upload') {
        await upload(input, options);
    } else if (input.action_type === 'preview') {
        preview_qrcode = await preview(input, options);
    } else {
        throw new Error(`unSupport action_type ${input.action_type}`);
    }
    return {
        preview_qrcode
    };
}
