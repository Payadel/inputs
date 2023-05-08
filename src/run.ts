import * as core from "@actions/core";
import * as github from "@actions/github";
import { getInputs, IYamlInput } from "./inputs";
import { setOutputs } from "./outputs";

const run = (): Promise<void> =>
    _mainProcess()
        .then(() => core.info("Operation completed successfully."))
        .catch(error => {
            core.error("Operation failed.");
            core.setFailed(
                error instanceof Error ? error.message : error.toString()
            );
        });

export default run;

function _mainProcess(): Promise<void> {
    return getInputs().then(actionInputs => {
        const allInputs = combineAllInputs(
            actionInputs.yamlInputs,
            github.context.payload.inputs
        );

        setOutputs(allInputs, actionInputs.logInputs);
    });
}

function combineAllInputs(
    yamlInputs: IYamlInput[],
    githubInputs: { [key: string]: string } | undefined
): { [key: string]: string } {
    const keys = getAllKeys(yamlInputs, githubInputs);

    //Combine inputs with GitHub context priority.
    const result: { [key: string]: string } = {};
    for (const key of keys) {
        if (githubInputs && githubInputs[key]) result[key] = githubInputs[key];
        else
            result[key] = yamlInputs.find(
                input => input.name.toLowerCase() === key
            )!.default;
    }

    return result;
}

function getAllKeys(
    yamlInputs: IYamlInput[] | undefined,
    githubInputs: { [key: string]: string } | undefined
): string[] {
    const yamlKeys = yamlInputs ? yamlInputs.map(input => input.name) : [];
    const githubKeys = githubInputs ? Object.keys(githubInputs) : [];

    return yamlKeys.concat(githubKeys);
}
