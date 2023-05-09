import * as core from "@actions/core";

export function getInputOrDefault(
    name: string,
    default_value: string | undefined = undefined,
    trimWhitespace = true,
    required = false
): string | undefined {
    const input = core.getInput(name, {
        trimWhitespace,
        required,
    });
    if (!input || input === "") {
        core.debug(
            `Try get ${name} but it is not provided so return default value '${default_value}'`
        );
        return default_value;
    }

    core.debug(`${name}: ${input}`);
    return input;
}

export function getBooleanInputOrDefault(
    name: string,
    defaultValue: boolean | undefined = undefined,
    required = false
): boolean | undefined {
    const input = getInputOrDefault(
        name,
        undefined,
        true,
        required
    )?.toLowerCase();
    if (!input) return defaultValue;
    if (input === "true") return true;
    if (input === "false") return false;
    throw new TypeError(
        `The value of '${name}' is not valid. It must be either true or false but got '${input}'.`
    );
}

export function findRepetitiveItems(strings: string[]): string[] {
    const count: { [key: string]: number } = {};
    for (const string of strings) {
        count[string] = (count[string] || 0) + 1;
    }

    const result: string[] = [];
    for (const string in count) {
        if (count[string] > 1) {
            result.push(string);
        }
    }

    return result;
}

export function areKeysValid(
    validList: string[],
    checkList: string[]
): boolean {
    if (!validList) throw new Error("The validList is required.");
    if (!checkList) throw new Error("The checkList is required.");

    for (const item of checkList) {
        if (!validList.includes(item)) return false;
    }
    return true;
}
