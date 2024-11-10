import * as core from '@actions/core'
import { IActionOutput, setOutputs } from '../src/outputs'

jest.mock('@actions/core')

describe('setOutputs', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should set all outputs', () => {
    const data: IActionOutput = {
      name: 'test',
      label: 'label',
      default: 'default'
    }

    jest.spyOn(core, 'setOutput')

    setOutputs([data], false)

    for (const output of [data]) {
      expect(core.setOutput).toHaveBeenCalledWith(output.name, output.default)
    }
  })
})
