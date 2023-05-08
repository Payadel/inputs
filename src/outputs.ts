import * as core from "@actions/core";

export interface IActionOutputs {
    [key: string]: string;
}

export function setOutputs(data: IActionOutputs, log: boolean): void {
    for (const key of Object.keys(data)) {
        core.setOutput(key, data[key]);
        if (log) core.info(`${key}: ${data[key]}`);
    }
}
