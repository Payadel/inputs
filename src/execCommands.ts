import { execCommand } from './utility'

export const COMMAND_REGEX = /\$\((.*?)\)/g

/**
 * Replaces embedded command expressions within a string with their executed results.
 *
 * @param str - The input string containing command expressions in the format `$(command)`.
 * @param verbose - Optional flag to control verbose output. Defaults to `false`.
 * @returns A promise resolving to the input string with command results substituted.
 * @throws Error if the `str` parameter is null or undefined.
 */
export async function executeCommands(
  str: string,
  verbose = false
): Promise<string> {
  // Validate input
  if (str === undefined || str === null) return ''

  // Find all command patterns in the input string
  const matches = str.match(COMMAND_REGEX)
  if (!matches) return str // Return as-is if no commands found

  // Process each matched command pattern
  for (const match of matches) {
    const command = match.slice(2, -1) // Extract command text within $(...)
    const result = await execCommand(command, undefined, undefined, {
      silent: !verbose
    }).then(output => output.stdout.trim()) // Trim trailing newlines/spaces from output

    str = str.replace(match, result) // Replace pattern with command output in string
  }

  return str
}
