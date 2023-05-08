import {
    findRepetitiveItems,
    getBooleanInputOrDefault,
    getInputOrDefault,
} from "./utility";
import * as yaml from "js-yaml";
import { DEFAULT_INPUTS } from "./configs";

export interface IInputs {
    yamlInputs: IYamlInput[];
    logInputs: boolean;
}

export interface IYamlInput {
    name: string;
    default: string;
}

export const getInputs = (): Promise<IInputs> =>
    new Promise<IInputs>(resolve => {
        const yamlInputsStr = getInputOrDefault(
            "inputs",
            undefined,
            true,
            false
        );
        let parsedYaml: IYamlInput[] | undefined;
        if (yamlInputsStr) {
            parsedYaml = yaml.load(yamlInputsStr);
            ensureYamlIsValid(parsedYaml!);
        }

        return resolve({
            yamlInputs: parsedYaml ?? DEFAULT_INPUTS.yamlInputs,
            logInputs:
                getBooleanInputOrDefault("log-inputs", undefined) ??
                DEFAULT_INPUTS.logInputs,
        });
    });

function ensureYamlIsValid(parsedYaml: IYamlInput[]): void {
    for (const item of parsedYaml) {
        if (!item.name) throw new Error(`The 'name' parameter is required.`);
        if (!item.default)
            throw new Error(
                `The 'default' parameter is required.\nItem:\n\t${JSON.stringify(
                    item
                )}`
            );
    }

    const repetitiveKeys = findRepetitiveItems(
        parsedYaml.map(item => item.name)
    );
    if (repetitiveKeys.length > 0)
        throw new Error(
            `Repetitive keys is not allowed: ${repetitiveKeys.join(", ")}`
        );
}
