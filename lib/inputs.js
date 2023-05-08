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
exports.getInputs = void 0;
const utility_1 = require("./utility");
const yaml = __importStar(require("js-yaml"));
const configs_1 = require("./configs");
const getInputs = () => new Promise(resolve => {
    var _a;
    return resolve({
        yamlInputs: getValidatedYamlInput(),
        logInputs: (_a = (0, utility_1.getBooleanInputOrDefault)("log-inputs", undefined)) !== null && _a !== void 0 ? _a : configs_1.DEFAULT_INPUTS.logInputs,
    });
});
exports.getInputs = getInputs;
function getValidatedYamlInput() {
    const yamlInputsStr = (0, utility_1.getInputOrDefault)("inputs", undefined, true, false);
    if (!yamlInputsStr)
        return configs_1.DEFAULT_INPUTS.yamlInputs;
    const parsedYaml = yaml.load(yamlInputsStr);
    ensureYamlIsValid(parsedYaml);
    return parsedYaml;
}
function ensureYamlIsValid(parsedYaml) {
    //Every item must has name and default key
    for (const item of parsedYaml) {
        if (!item.name)
            throw new Error(`The 'name' parameter is required.`);
        if (!item.default)
            throw new Error(`The 'default' parameter is required.\nItem:\n\t${JSON.stringify(item)}`);
    }
    // The name can not be repetitive.
    const repetitiveKeys = (0, utility_1.findRepetitiveItems)(parsedYaml.map(item => item.name));
    if (repetitiveKeys.length > 0)
        throw new Error(`Repetitive keys is not allowed: ${repetitiveKeys.join(", ")}`);
}
//# sourceMappingURL=inputs.js.map