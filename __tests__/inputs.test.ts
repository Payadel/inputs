import * as core from '@actions/core'
import { getInputs, IInputs, VALID_YAML_KEYS } from '../src/inputs'
import { AppInputNames, mockGetInput } from './mocks.utility'
import { DEFAULT_INPUTS } from '../src/configs'

jest.mock('@actions/core')

describe('getInputs', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('default inputs', () => {
    jest
      .spyOn(core, 'getInput')
      .mockImplementation((name: string, options?: core.InputOptions) =>
        mockGetInput(name, [], options)
      )

    const inputs: IInputs = getInputs(DEFAULT_INPUTS)

    expect(inputs.logInputs).toBe(DEFAULT_INPUTS.logInputs)
    expect(inputs.yamlInputs).toBe(DEFAULT_INPUTS.yamlInputs)
  })

  it('yaml input is not valid, so should reject', () => {
    jest
      .spyOn(core, 'getInput')
      .mockImplementation((name: string, options?: core.InputOptions) =>
        mockGetInput(
          name,
          [{ name: AppInputNames.yamlInputs, givenValue: ' invalid yaml ' }],
          options
        )
      )
    expect(() => getInputs(DEFAULT_INPUTS)).toThrow(
      "The 'name' parameter is required."
    )

    jest
      .spyOn(core, 'getInput')
      .mockImplementation((name: string, options?: core.InputOptions) =>
        mockGetInput(
          name,
          [
            {
              name: AppInputNames.yamlInputs,
              givenValue: `
                                    - name: param
                                `
            }
          ],
          options
        )
      )
    expect(() => getInputs(DEFAULT_INPUTS)).toThrow(
      `The 'default' parameter is required.
Item:
\t{"name":"param"}`
    )
  })

  it('yaml keys are not valid, so should reject', () => {
    jest
      .spyOn(core, 'getInput')
      .mockImplementation((name: string, options?: core.InputOptions) =>
        mockGetInput(
          name,
          [
            {
              name: AppInputNames.yamlInputs,
              givenValue: `
- name: valid
  default: valid
- name: invalid
  default: invalid
  invalid-key: invalid
                `
            }
          ],
          options
        )
      )
    expect(() => getInputs(DEFAULT_INPUTS)).toThrow(
      `Yaml keys are not valid. It has unexpected key(s).
Item Keys: name, default, invalid-key
Valid keys: ${VALID_YAML_KEYS.join(', ')}`
    )
  })

  it('give repetitive input name', () => {
    jest
      .spyOn(core, 'getInput')
      .mockImplementation((name: string, options?: core.InputOptions) =>
        mockGetInput(
          name,
          [
            {
              name: AppInputNames.yamlInputs,
              givenValue: `
- name: 'param1'
  default: 'value1'
- name: 'param2'
  default: 'value2'
- name: 'param1'
  default: 'value2'
                `
            }
          ],
          options
        )
      )

    expect(() => getInputs(DEFAULT_INPUTS)).toThrow(
      `Repetitive keys is not allowed: param1`
    )
  })

  it('give valid inputs', () => {
    jest
      .spyOn(core, 'getInput')
      .mockImplementation((name: string, options?: core.InputOptions) =>
        mockGetInput(
          name,
          [
            {
              name: AppInputNames.yamlInputs,
              givenValue: `
- name: 'param1'
  default: 'value1'
- name: 'param2'
  default: 'value2'
                `
            }
          ],
          options
        )
      )

    expect(() => getInputs(DEFAULT_INPUTS)).not.toThrow()
  })

  it('the default key is exist but empty, should resolve', () => {
    jest
      .spyOn(core, 'getInput')
      .mockImplementation((name: string, options?: core.InputOptions) =>
        mockGetInput(
          name,
          [
            {
              name: AppInputNames.yamlInputs,
              givenValue: `
- name: 'param1'
  default: 'value1'
- name: 'param2'
  default: ''
                `
            }
          ],
          options
        )
      )

    expect(() => getInputs(DEFAULT_INPUTS)).not.toThrow()
  })

  it('give invalid variable name', () => {
    let variableName = 'contain space'
    jest
      .spyOn(core, 'getInput')
      .mockImplementation((name: string, options?: core.InputOptions) =>
        mockGetInput(
          name,
          [
            {
              name: AppInputNames.yamlInputs,
              givenValue: `- name: '${variableName}'`
            }
          ],
          options
        )
      )
    expect(() => getInputs(DEFAULT_INPUTS)).toThrow(
      `The variable name ${variableName} is not valid. It must start with (a letter or _) and only contain (letter, number, _ and -).`
    )

    variableName = '1start-with-number'
    jest
      .spyOn(core, 'getInput')
      .mockImplementation((name: string, options?: core.InputOptions) =>
        mockGetInput(
          name,
          [
            {
              name: AppInputNames.yamlInputs,
              givenValue: `- name: '${variableName}'`
            }
          ],
          options
        )
      )
    expect(() => getInputs(DEFAULT_INPUTS)).toThrow(
      `The variable name ${variableName} is not valid. It must start with (a letter or _) and only contain (letter, number, _ and -).`
    )
  })
})
