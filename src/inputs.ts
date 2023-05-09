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
    label?: string;
}

export const getInputs = (): Promise<IInputs> =>
    new Promise<IInputs>(resolve => {
        return resolve({
            yamlInputs: getValidatedYamlInput(),
            logInputs:
                getBooleanInputOrDefault("log-inputs", undefined) ??
                DEFAULT_INPUTS.logInputs,
        });
    });

function getValidatedYamlInput(): IYamlInput[] {
    const yamlInputsStr = getInputOrDefault("inputs", undefined, true, false);
    if (!yamlInputsStr) return DEFAULT_INPUTS.yamlInputs;

    const parsedYaml = yaml.load(yamlInputsStr);
    ensureYamlIsValid(parsedYaml);
    return parsedYaml;
}

function ensureYamlIsValid(parsedYaml: IYamlInput[]): void {
    //Every item must has name and default key
    for (const item of parsedYaml) {
        if (!item.name) throw new Error(`The 'name' parameter is required.`);
        if (item.default === undefined)
            throw new Error(
                `The 'default' parameter is required.\nItem:\n\t${JSON.stringify(
                    item
                )}`
            );
    }

    // The name can not be repetitive.
    const repetitiveKeys = findRepetitiveItems(
        parsedYaml.map(item => item.name)
    );
    if (repetitiveKeys.length > 0)
        throw new Error(
            `Repetitive keys is not allowed: ${repetitiveKeys.join(", ")}`
        );
}
