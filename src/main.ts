import * as core from '@actions/core'
import * as github from '@actions/github'
import { getInputs, IInputs, IYamlInput } from './inputs'
import { setOutputs } from './outputs'
import { executeCommands } from './execCommands'

export default async function run(defaultInputs: IInputs): Promise<void> {
  try {
    await mainProcess(defaultInputs)
    core.debug('Operation completed successfully.')
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.error('Operation failed.')
    // @ts-expect-error we want catch all errors as string
    core.setFailed(error instanceof Error ? error.message : error.toString())
  }
}

async function mainProcess(defaultInputs: IInputs): Promise<IInputs> {
  const actionInputs = getInputs(defaultInputs)

  const allInputs = combineInputs(
    actionInputs.yamlInputs,
    github.context.payload.inputs
  )

  return _executeCommands(allInputs, actionInputs.verbose)
    .then(() => setOutputs(allInputs, actionInputs.logInputs))
    .then(() => {
      actionInputs.yamlInputs = allInputs
      return actionInputs
    })
}

async function _executeCommands(
  inputs: IYamlInput[],
  verbose: boolean
): Promise<void> {
  for (const input of inputs) {
    if (input.skipCommands) continue

    await executeCommands(input.default, verbose).then(
      result => (input.default = result)
    )
  }
}

function combineInputs(
  yamlInputs: IYamlInput[],
  githubInputs: { [key: string]: string } | undefined
): IYamlInput[] {
  const result = yamlInputs
  if (githubInputs) addOrUpdate(result, githubInputs)
  return result
}

function addOrUpdate(
  result: IYamlInput[],
  githubInputs: { [key: string]: string }
): void {
  for (const key of Object.keys(githubInputs)) {
    const targetIndex = result.findIndex(item => item.name === key)
    if (targetIndex > 0) {
      result[targetIndex].default = githubInputs[key]
    } else {
      result.push({
        name: key,
        default: githubInputs[key]
      })
    }
  }
}
