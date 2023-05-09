import * as core from "@actions/core";
import * as github from "@actions/github";
import { getInputs, IInputs, IYamlInput } from "./inputs";
import { setOutputs } from "./outputs";
import { executeCommands } from "./execCommands";

const run = (defaultInputs: IInputs): Promise<void> =>
    _mainProcess(defaultInputs)
        .then(() => core.info("Operation completed successfully."))
        .catch(error => {
            core.error("Operation failed.");
            core.setFailed(
                error instanceof Error ? error.message : error.toString()
            );
        });

export default run;

function _mainProcess(defaultInputs: IInputs): Promise<void> {
    return getInputs(defaultInputs).then(actionInputs => {
        const allInputs = combineInputs(
            actionInputs.yamlInputs,
            github.context.payload.inputs
        );

        return _executeCommands(allInputs).then(() =>
            setOutputs(allInputs, actionInputs.logInputs)
        );
    });
}

async function _executeCommands(inputs: IYamlInput[]): Promise<void> {
    for (const input of inputs) {
        if (input.skipCommands) continue;

        await executeCommands(input.default).then(
            result => (input.default = result)
        );
    }
}

function combineInputs(
    yamlInputs: IYamlInput[],
    githubInputs: { [key: string]: string } | undefined
): IYamlInput[] {
    const result = yamlInputs;
    if (githubInputs) addOrUpdate(result, githubInputs);
    return result;
}

function addOrUpdate(
    result: IYamlInput[],
    githubInputs: { [key: string]: string }
): void {
    for (const key of Object.keys(githubInputs)) {
        const targetIndex = result.findIndex(item => item.name === key);
        if (targetIndex > 0) {
            result[targetIndex].default = githubInputs[key];
        } else {
            result.push({
                name: key,
                default: githubInputs[key],
            });
        }
    }
}
