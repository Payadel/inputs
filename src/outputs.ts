import * as core from "@actions/core";
import { IYamlInput } from "./inputs";

export function setOutputs(outputs: IYamlInput[], log: boolean): void {
    for (const output of outputs) {
        core.setOutput(output.name, output.default);

        if (log) {
            const keyName = output.label ? output.label : output.name;
            core.info(`${keyName}: ${output.default}`);
        }
    }
}
