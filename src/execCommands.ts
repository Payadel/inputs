import { execCommand } from "./utility";

export const COMMAND_REGEX = /\$\((.*?)\)/g;

export async function executeCommands(
    str: string,
    verbose = false
): Promise<string> {
    if (str === undefined || str === null)
        throw new Error("The str parameter is required.");

    const matches = str.match(COMMAND_REGEX);
    if (!matches) return str;

    for (const match of matches) {
        const command = match.substring(2, match.length - 1);
        const result = await execCommand(command, undefined, undefined, {
            silent: !verbose,
        }).then(output => output.stdout.trim());
        str = str.replace(match, result);
    }

    return str;
}
