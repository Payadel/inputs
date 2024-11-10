import * as exec from '@actions/exec'
import * as core from '@actions/core'

export const AppInputNames = {
  yamlInputs: 'inputs',
  logInputs: 'log-inputs',
  verbose: 'verbose'
}

export interface IExpectedCommand {
  command: string
  success: boolean
  resolve?: {
    stdout: string
    stderr: string
    exitCode: number
  }
  rejectMessage?: string
}

export function mockGetExecOutput(
  commandLine: string,
  expectedCommands: IExpectedCommand[]
): Promise<exec.ExecOutput> {
  return new Promise((resolve, reject) => {
    commandLine = commandLine.toLowerCase()
    const target = expectedCommands.find(
      input => input.command.toLowerCase() === commandLine
    )

    if (!target) {
      reject(new Error('Command not found.'))
    } else if (target.success) {
      resolve(target.resolve!)
    } else {
      reject(new Error(target.rejectMessage))
    }
  })
}

export interface IInputMock {
  name: string
  givenValue?: string | boolean | number
  defaultValue?: string
}

export function mockGetInput(
  name: string,
  mockInputs: IInputMock[],
  options?: core.InputOptions
): string {
  name = name.toLowerCase()
  const targetMock = mockInputs.find(
    mockInput => mockInput.name.toLowerCase() == name
  )

  let result = ''
  if (targetMock) {
    result = targetMock.givenValue
      ? targetMock.givenValue.toString()
      : (targetMock.defaultValue ?? '')
  }

  if (options) {
    if (options.required && !result)
      throw new Error(`Input required and not supplied: ${name}`)
    if (result && options.trimWhitespace) result = result.trim()
  }

  return result
}

export function mockSetOutput(
  name: string,
  value: any,
  output: { [key: string]: any }
): void {
  output[name] = value
}
