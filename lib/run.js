"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const inputs_1 = require("./inputs");
const outputs_1 = require("./outputs");
// import * as github from "@actions/github";
// import * as exec from "@actions/exec";
const run = () => _mainProcess()
    .then(() => core.info("Operation completed successfully."))
    .catch(error => {
    core.error("Operation failed.");
    core.setFailed(error instanceof Error ? error.message : error.toString());
});
exports.default = run;
function _mainProcess() {
    return (0, inputs_1.getInputs)().then(inputs => (0, inputs_1.ensureInputsValid)(inputs).then(() => {
        core.debug(`who-to-great: ${inputs.nameToGreet}`);
        const helloMessage = `Hello ${inputs.nameToGreet}!`;
        core.info(helloMessage);
        (0, outputs_1.setOutputs)({ "hello-message": helloMessage });
        // Get the JSON webhook payload for the event that triggered the workflow
        // const payload = JSON.stringify(github.context.payload, undefined, 2);
        // core.info(`The event payload: ${payload}`);
    }));
}
//# sourceMappingURL=run.js.map