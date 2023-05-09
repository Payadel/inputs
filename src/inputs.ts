import {
    areKeysValid,
    findRepetitiveItems,
    getBooleanInputOrDefault,
    getInputOrDefault,
} from "./utility";
import * as yaml from "js-yaml";

export interface IInputs {
    yamlInputs: IYamlInput[];
    logInputs: boolean;
}

export interface IYamlInput {
    name: string;
    default: string;
    label?: string;
    skipCommands?: boolean;
}

export const VALID_YAML_KEYS = ["name", "default", "label", "skipCommands"];

export const getInputs = (defaultInputs: IInputs): Promise<IInputs> =>
    new Promise<IInputs>(resolve => {
        return resolve({
            yamlInputs: getValidatedYamlInput(defaultInputs.yamlInputs),
            logInputs:
                getBooleanInputOrDefault("log-inputs", undefined) ??
                defaultInputs.logInputs,
        });
    });

function getValidatedYamlInput(defaultYamlInput: IYamlInput[]): IYamlInput[] {
    const yamlInputsStr = getInputOrDefault("inputs", undefined, true, false);
    if (!yamlInputsStr) return defaultYamlInput;

    const parsedYaml = yaml.load(yamlInputsStr);
    ensureYamlIsValid(parsedYaml);
    return parsedYaml;
}

function ensureYamlIsValid(parsedYaml: IYamlInput[]): void {
    //Every item must has name and default key
    for (const item of parsedYaml) {
        ensureNameIsValid(item.name);

        const itemKeys = Object.keys(item);
        if (!areKeysValid(VALID_YAML_KEYS, itemKeys))
            throw new Error(
                `Yaml keys are not valid. It has unexpected key(s).\nItem Keys: ${itemKeys.join(
                    ", "
                )}\nValid keys: ${VALID_YAML_KEYS.join(", ")}`
            );

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

function ensureNameIsValid(name?: string): void {
    if (!name) throw new Error(`The 'name' parameter is required.`);
    const variableNameRegex = /^([a-zA-Z_][a-zA-Z0-9_-]*)$/;
    if (!variableNameRegex.test(name))
        throw new Error(
            `The variable name ${name} is not valid. It must start with (a letter or _) and only contain (letter, number, _ and -).`
        );
}
