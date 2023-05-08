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
const github = __importStar(require("@actions/github"));
const inputs_1 = require("./inputs");
const outputs_1 = require("./outputs");
const run = () => _mainProcess()
    .then(() => core.info("Operation completed successfully."))
    .catch(error => {
    core.error("Operation failed.");
    core.setFailed(error instanceof Error ? error.message : error.toString());
});
exports.default = run;
function _mainProcess() {
    return (0, inputs_1.getInputs)().then(actionInputs => {
        const allInputs = combineAllInputs(actionInputs.yamlInputs, github.context.payload.inputs);
        (0, outputs_1.setOutputs)(allInputs, actionInputs.logInputs);
    });
}
function combineAllInputs(yamlInputs, githubInputs) {
    const keys = getAllKeys(yamlInputs, githubInputs);
    //Combine inputs with GitHub context priority.
    const result = {};
    for (const key of keys) {
        if (githubInputs && githubInputs[key])
            result[key] = githubInputs[key];
        else
            result[key] = yamlInputs.find(input => input.name.toLowerCase() === key).default;
    }
    return result;
}
function getAllKeys(yamlInputs, githubInputs) {
    const yamlKeys = yamlInputs ? yamlInputs.map(input => input.name) : [];
    const githubKeys = githubInputs ? Object.keys(githubInputs) : [];
    return yamlKeys.concat(githubKeys);
}
//# sourceMappingURL=run.js.map