import {Inputs, Outputs} from "./main";
import {upload, preview} from "./uploadapi";

export async function run(input: Inputs): Promise<Outputs> {
    let preview_qrcode;
    if (input.action_type === 'upload') {
        await upload(input);
    } else if (input.action_type === 'preview') {
        preview_qrcode = await preview(input);
    } else {
        throw new Error(`unSupport action_type ${input.action_type}`);
    }
    return {
        preview_qrcode
    };
}
