import { getInputOrDefault } from "./utility";
import * as yaml from "js-yaml";

export interface IInputs {
    inputsYaml: any[];
}

export const getInputs = (): Promise<IInputs> =>
    new Promise<IInputs>(resolve => {
        const inputs = getInputOrDefault("inputs", "", true, false);
        const parsedYaml = yaml.load(inputs);

        return resolve({
            inputsYaml: parsedYaml,
        });
    });
