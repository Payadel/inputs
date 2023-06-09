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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const inputs_1 = require("./inputs");
const outputs_1 = require("./outputs");
const execCommands_1 = require("./execCommands");
const run = (defaultInputs) => _mainProcess(defaultInputs)
    .then(inputs => {
    if (inputs.verbose)
        core.info("Operation completed successfully.");
})
    .catch(error => {
    core.error("Operation failed.");
    core.setFailed(error instanceof Error ? error.message : error.toString());
});
exports.default = run;
function _mainProcess(defaultInputs) {
    return (0, inputs_1.getInputs)(defaultInputs).then(actionInputs => {
        const allInputs = combineInputs(actionInputs.yamlInputs, github.context.payload.inputs);
        return _executeCommands(allInputs, actionInputs.verbose)
            .then(() => (0, outputs_1.setOutputs)(allInputs, actionInputs.logInputs))
            .then(() => {
            actionInputs.yamlInputs = allInputs;
            return actionInputs;
        });
    });
}
function _executeCommands(inputs, verbose) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const input of inputs) {
            if (input.skipCommands)
                continue;
            yield (0, execCommands_1.executeCommands)(input.default, verbose).then(result => (input.default = result));
        }
    });
}
function combineInputs(yamlInputs, githubInputs) {
    const result = yamlInputs;
    if (githubInputs)
        addOrUpdate(result, githubInputs);
    return result;
}
function addOrUpdate(result, githubInputs) {
    for (const key of Object.keys(githubInputs)) {
        const targetIndex = result.findIndex(item => item.name === key);
        if (targetIndex > 0) {
            result[targetIndex].default = githubInputs[key];
        }
        else {
            result.push({
                name: key,
                default: githubInputs[key],
            });
        }
    }
}
//# sourceMappingURL=run.js.map