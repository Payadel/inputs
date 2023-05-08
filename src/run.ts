import * as core from "@actions/core";
import { getInputs } from "./inputs";
import * as github from "@actions/github";

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
        // Get inputs from GitHub context
        const contextInputs = github.context.payload.inputs;

        for (const inputName in contextInputs) {
            //set inputs to outputs
            const inputValue = contextInputs[inputName];
            core.setOutput(inputName, inputValue);

            //Log inputs if is requested.
            if (actionInputs.logInputs)
                core.info(`${inputName}: ${inputValue}`);
        }
    });
}
