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
    return getInputs().then(() => {
        const contextInputs = github.context.payload.inputs;
        core.info(`github.context.payload.inputs: ${contextInputs}`);

        for (const inputName in contextInputs) {
            const inputValue = contextInputs[inputName];
            core.info(`Input "${inputName}" has value "${inputValue}"`);
        }

        const payload = JSON.stringify(github.context.payload, undefined, 2);
        core.info(`The event payload: ${payload}`);
    });
}
