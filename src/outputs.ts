import * as core from "@actions/core";

export interface IActionOutputs {
    [key: string]: string;
}

export function setOutputs(data: IActionOutputs): void {
    for (const key of Object.keys(data)) core.setOutput(key, data[key]);
}
