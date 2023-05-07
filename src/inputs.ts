import { getBooleanInputOrDefault, getInputOrDefault } from "./utility";
import * as yaml from "js-yaml";
import { DEFAULT_INPUTS } from "./configs";

export interface IInputs {
    inputsYaml: any[];
    logInputs: boolean;
}

export const getInputs = (): Promise<IInputs> =>
    new Promise<IInputs>(resolve => {
        const inputs = getInputOrDefault("inputs", "", true, false);
        const parsedYaml = yaml.load(inputs);

        return resolve({
            inputsYaml: parsedYaml,
            logInputs:
                getBooleanInputOrDefault("log-inputs", undefined) ??
                DEFAULT_INPUTS.logInputs,
        });
    });
