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
exports.findRepetitiveItems = exports.getBooleanInputOrDefault = exports.getInputOrDefault = void 0;
const core = __importStar(require("@actions/core"));
function getInputOrDefault(name, default_value = undefined, trimWhitespace = true, required = false) {
    const input = core.getInput(name, {
        trimWhitespace,
        required,
    });
    if (!input || input === "") {
        core.debug(`Try get ${name} but it is not provided so return default value '${default_value}'`);
        return default_value;
    }
    core.debug(`${name}: ${input}`);
    return input;
}
exports.getInputOrDefault = getInputOrDefault;
function getBooleanInputOrDefault(name, defaultValue = undefined, required = false) {
    var _a;
    const input = (_a = getInputOrDefault(name, undefined, true, required)) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    if (!input)
        return defaultValue;
    if (input === "true")
        return true;
    if (input === "false")
        return false;
    throw new TypeError(`The value of '${name}' is not valid. It must be either true or false but got '${input}'.`);
}
exports.getBooleanInputOrDefault = getBooleanInputOrDefault;
function findRepetitiveItems(strings) {
    const count = {};
    for (const string of strings) {
        count[string] = (count[string] || 0) + 1;
    }
    const result = [];
    for (const string in count) {
        if (count[string] > 1) {
            result.push(string);
        }
    }
    return result;
}
exports.findRepetitiveItems = findRepetitiveItems;
//# sourceMappingURL=utility.js.map