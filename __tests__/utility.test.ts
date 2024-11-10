import { join } from 'path'
import * as exec from '@actions/exec'
import * as core from '@actions/core'
import {
  areKeysValid,
  execBashCommand,
  execCommand,
  findRepetitiveItems,
  getBooleanInputOrDefault,
  getInputOrDefault,
  getNumberInputOrDefault,
  readFile
} from '../src/utility'
import { mockGetExecOutput, mockGetInput } from './mocks.utility'
import fs, { mkdtempSync, writeFileSync } from 'fs'

describe('execBashCommand', () => {
  jest.mock('@actions/exec')

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should execute a bash command and return the output', async () => {
    jest.spyOn(exec, 'getExecOutput').mockImplementation(async command =>
      mockGetExecOutput(command, [
        {
          command: '/bin/bash -c "echo \'Hello World\' && exit 0"',
          success: true,
          resolve: {
            stdout: 'Hello World',
            stderr: '',
            exitCode: 0
          }
        }
      ])
    )

    let result = await execBashCommand("echo 'Hello World' && exit 0")
    expect(result.stdout).toEqual('Hello World')
    expect(result.stderr).toEqual('')
    expect(result.exitCode).toEqual(0)

    result = await execBashCommand('echo "Hello World" && exit 0')
    expect(result.stdout).toEqual('Hello World')
    expect(result.stderr).toEqual('')
    expect(result.exitCode).toEqual(0)
  })

  it('give invalid command. throw error with exit code', async () => {
    jest
      .spyOn(exec, 'getExecOutput')
      .mockImplementation(async command => mockGetExecOutput(command, []))

    await expect(execBashCommand('non_existent_command')).rejects.toThrow(
      'Execute \'/bin/bash -c "non_existent_command"\' failed.'
    )
  })
})

describe('execCommand', () => {
  jest.mock('@actions/exec')

  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('should execute command successfully', async () => {
    jest.spyOn(exec, 'getExecOutput').mockImplementation(async command =>
      mockGetExecOutput(command, [
        {
          command: 'echo "Hello World"',
          success: true,
          resolve: {
            stdout: 'Hello World',
            stderr: '',
            exitCode: 0
          }
        }
      ])
    )

    const output = await execCommand('echo "Hello World"')
    expect(output.stdout.trim()).toBe('Hello World')
    expect(output.stderr).toBeFalsy()
    expect(output.exitCode).toBe(0)
  })

  test('should throw an error when the command fails', async () => {
    jest
      .spyOn(exec, 'getExecOutput')
      .mockImplementation(command => mockGetExecOutput(command, []))

    await expect(execCommand('invalid-command')).rejects.toThrow(
      "Execute 'invalid-command' failed."
    )
  })

  test('should throw an error with custom error message when provided', async () => {
    jest
      .spyOn(exec, 'getExecOutput')
      .mockImplementation(async command => mockGetExecOutput(command, []))

    const customMessage = 'Custom error message'
    await expect(execCommand('invalid-command', customMessage)).rejects.toThrow(
      new RegExp(customMessage)
    )
  })
})

describe('readFile', () => {
  let tempDir: string
  let filePath: string
  const content = 'sample content'

  beforeEach(() => {
    // Create a unique temporary directory with a random name
    tempDir = mkdtempSync('/tmp/test-')

    // Write a package.json file to the temporary directory
    filePath = join(tempDir, 'file.txt')
    writeFileSync(filePath, `    ${content}   `)
  })

  afterEach(() => {
    // Delete the temporary directory
    fs.rmSync(tempDir, { recursive: true })
  })

  test('should read file and return text with trim', () => {
    const content = readFile(filePath)
    expect(content).toBe(content)
  })

  test('give invalid path, should throw error', () => {
    expect(() => readFile('invalid path')).toThrow(
      "Can not find 'invalid path'."
    )
  })
})

describe('getInputOrDefault', () => {
  jest.mock('@actions/core')

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should return input data', () => {
    jest
      .spyOn(core, 'getInput')
      .mockImplementation((name: string, options?: core.InputOptions) =>
        mockGetInput(
          name,
          [{ name: 'test', givenValue: `test-value` }],
          options
        )
      )

    const input = getInputOrDefault('test', 'default')

    expect(input).toBe('test-value')
  })

  it('should return default value', () => {
    jest
      .spyOn(core, 'getInput')
      .mockImplementation((name: string, options?: core.InputOptions) =>
        mockGetInput(name, [{ name: 'test', givenValue: `` }], options)
      )

    const input = getInputOrDefault('test', 'default')

    expect(input).toBe('default')
  })
})

describe('getBooleanInputOrDefault', () => {
  jest.mock('@actions/core')

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should return default value', () => {
    jest
      .spyOn(core, 'getInput')
      .mockImplementation((name: string, options?: core.InputOptions) =>
        mockGetInput(name, [{ name: 'test', givenValue: `` }], options)
      )

    const input = getBooleanInputOrDefault('test', true)

    expect(input).toBe(true)
  })

  it('should return true', () => {
    jest
      .spyOn(core, 'getInput')
      .mockImplementation((name: string, options?: core.InputOptions) =>
        mockGetInput(
          name,
          [
            { name: 'test1', givenValue: `true` },
            { name: 'test2', givenValue: `TrUe` }
          ],
          options
        )
      )

    let input = getBooleanInputOrDefault('test1', false)
    expect(input).toBe(true)

    input = getBooleanInputOrDefault('test2', false)
    expect(input).toBe(true)
  })

  it('should return false', () => {
    jest
      .spyOn(core, 'getInput')
      .mockImplementation((name: string, options?: core.InputOptions) =>
        mockGetInput(
          name,
          [
            { name: 'test1', givenValue: `false` },
            { name: 'test2', givenValue: `FalSE` }
          ],
          options
        )
      )

    let input = getBooleanInputOrDefault('test1', true)
    expect(input).toBe(false)

    input = getBooleanInputOrDefault('test2', true)
    expect(input).toBe(false)
  })

  it('give invalid input. expect throw error', () => {
    jest
      .spyOn(core, 'getInput')
      .mockImplementation((name: string, options?: core.InputOptions) =>
        mockGetInput(
          name,
          [
            { name: 'test1', givenValue: `false` },
            { name: 'test2', givenValue: `invalid` }
          ],
          options
        )
      )

    expect(() => getBooleanInputOrDefault('test2', true)).toThrow(
      "The value of 'test2' is not valid. It must be either true or false but got 'invalid'."
    )
  })
})

describe('getNumberInputOrDefault', () => {
  jest.mock('@actions/core')

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should return default value', () => {
    jest
      .spyOn(core, 'getInput')
      .mockImplementation((name: string, options?: core.InputOptions) =>
        mockGetInput(name, [{ name: 'test', givenValue: `` }], options)
      )

    const expected = 10
    const input = getNumberInputOrDefault('test', expected)

    expect(input).toBe(expected)
  })

  it('should return given value', () => {
    jest
      .spyOn(core, 'getInput')
      .mockImplementation((name: string, options?: core.InputOptions) =>
        mockGetInput(
          name,
          [{ name: 'test', givenValue: `    10    ` }],
          options
        )
      )

    const input = getNumberInputOrDefault('test')
    expect(input).toBe(10)
  })

  it('give invalid input. expect throw error', () => {
    jest
      .spyOn(core, 'getInput')
      .mockImplementation((name: string, options?: core.InputOptions) =>
        mockGetInput(name, [{ name: 'test', givenValue: `abc` }], options)
      )

    expect(() => getNumberInputOrDefault('test', 10)).toThrow(
      `Can not convert 'abc' to number.`
    )
  })
})

describe('findRepetitiveItems', () => {
  it('give empty input, should return empty list', () => {
    expect(findRepetitiveItems([]).length).toBe(0)
  })

  it("give a list that hasn't repetitive items, should return empty list", () => {
    expect(findRepetitiveItems(['a', 'b', 'c', 'd']).length).toBe(0)
  })

  it('give a list that has repetitive items, should return repetitive items', () => {
    const repetitiveItems = findRepetitiveItems(['a', 'b', 'c', 'd', 'b', 'c'])

    expect(repetitiveItems.join(' ')).toBe('b c')
  })
})

describe('areKeysValid', () => {
  it('give valid keys', () => {
    expect(areKeysValid(['key1', 'key2'], [])).toBe(true)
    expect(areKeysValid(['key1', 'key2'], ['key1'])).toBe(true)
    expect(areKeysValid(['key1', 'key2'], ['key1', 'key2'])).toBe(true)
  })

  it('give invalid keys', () => {
    expect(areKeysValid(['key1', 'key2'], ['invalid'])).toBe(false)
    expect(areKeysValid(['key1', 'key2'], ['key1', 'invalid'])).toBe(false)
    expect(areKeysValid(['key1', 'key2'], ['key1', 'key2', 'invalid'])).toBe(
      false
    )
  })
})
