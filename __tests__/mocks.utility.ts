import * as core from "@actions/core";

export function mockGetInput(
    name: string,
    inputs: { [key: string]: any },
    options?: core.InputOptions | undefined
) {
    name = name.toLowerCase();
    const targetName = Object.keys(inputs).find(
        key => key.toLowerCase() == name
    );
    let result = targetName ? inputs[targetName] : "";

    if (options && options.required && !result)
        throw new Error(`Input required and not supplied: ${name}`);
    if (options && options.trimWhitespace) result = result.trim();
    return result;
}
