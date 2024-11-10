import * as core from '@actions/core'

export interface IActionOutput {
  name: string
  default: string
  label?: string
}

export function setOutputs(outputs: IActionOutput[], log: boolean): void {
  for (const output of outputs) {
    core.setOutput(output.name, output.default)

    if (log) {
      const keyName = output.label ? output.label : output.name
      core.info(`${keyName}: ${output.default}`)
    }
  }
}
