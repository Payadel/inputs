import * as exec from '@actions/exec'
import fs from 'fs'
import * as core from '@actions/core'

export async function execBashCommand(
  command: string,
  errorMessage?: string,
  args?: string[],
  options?: exec.ExecOptions
): Promise<exec.ExecOutput> {
  command = command.replace(/"/g, "'")
  command = `/bin/bash -c "${command}"`
  core.debug(`Execute command: ${command}`)

  return await execCommand(command, errorMessage, args, options)
}

export async function execCommand(
  command: string,
  errorMessage?: string,
  args?: string[],
  options?: exec.ExecOptions
): Promise<exec.ExecOutput> {
  core.debug(`Execute command: ${command}`)
  try {
    return await exec.getExecOutput(command, args, options)
  } catch (error: any) {
    const title = errorMessage || `Execute '${command}' failed.`
    const message = error instanceof Error ? error.message : error.toString()
    throw new Error(`${title}\n${message}`)
  }
}

export function readFile(fileName: string): string {
  core.debug(`Reading file: ${fileName}`)

  if (!fs.existsSync(fileName)) {
    throw new Error(`Can not find '${fileName}'.`)
  }

  return fs.readFileSync(fileName, 'utf8').trim()
}

export function getInputOrDefault(
  name: string,
  default_value: string | undefined = undefined,
  trimWhitespace = true,
  required = false
): string | undefined {
  const input = core.getInput(name, {
    trimWhitespace,
    required
  })
  if (!input || input === '') {
    core.debug(
      `Try get ${name} but it is not provided so return default value '${default_value}'`
    )
    return default_value
  }

  core.debug(`${name}: ${input}`)
  return input
}

export function getNumberInputOrDefault(
  name: string,
  default_value: number | undefined = undefined,
  required = false
): number | undefined {
  const input = core.getInput(name, {
    trimWhitespace: true,
    required: required
  })
  if (!input || input === '') {
    core.debug(
      `Try get ${name} but it is not provided so return default value '${default_value}'`
    )
    return default_value
  }

  core.debug(`${name}: ${input}`)
  const result = parseInt(input, 10)
  if (result) return result
  throw new Error(`Can not convert '${input}' to number.`)
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
  )?.toLowerCase()
  if (!input) return defaultValue
  if (input === 'true') return true
  if (input === 'false') return false
  throw new TypeError(
    `The value of '${name}' is not valid. It must be either true or false but got '${input}'.`
  )
}

export function findRepetitiveItems(strings: string[]): string[] {
  const count: { [key: string]: number } = {}
  for (const string of strings) {
    count[string] = (count[string] || 0) + 1
  }

  const result: string[] = []
  for (const string in count) {
    if (count[string] > 1) {
      result.push(string)
    }
  }

  return result
}

export function areKeysValid(
  validList: string[],
  checkList: string[]
): boolean {
  if (!validList) throw new Error('The validList is required.')
  if (!checkList) throw new Error('The checkList is required.')

  for (const item of checkList) {
    if (!validList.includes(item)) return false
  }
  return true
}
