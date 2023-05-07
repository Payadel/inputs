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
