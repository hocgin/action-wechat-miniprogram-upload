import * as core from '@actions/core';
import * as github from '@actions/github';
import {
    PullRequestEvent, PushEvent,
    ReleaseEvent,
} from '@octokit/webhooks-definitions/schema'
import {Inputs, Outputs} from "./main";

export function run(input: Inputs): Outputs {
    // const octokit = getOctokit(process.env.GITHUB_TOKEN!, {});
    let context = github.context;

    // TODO 写你的代码..
    return {};
}
