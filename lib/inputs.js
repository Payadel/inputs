"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureInputsValid = exports.getInputs = void 0;
const utility_1 = require("./utility");
const configs_1 = require("./configs");
const getInputs = () => new Promise(resolve => {
    var _a;
    return resolve({
        nameToGreet: (_a = (0, utility_1.getInputOrDefault)("who-to-great", undefined, true, true)) !== null && _a !== void 0 ? _a : configs_1.DEFAULT_INPUTS.nameToGreet,
    });
});
exports.getInputs = getInputs;
function ensureInputsValid(inputs) {
    return new Promise((resolve, reject) => {
        return inputs.nameToGreet
            ? resolve()
            : reject(new Error("The 'who-to-great' parameter is required."));
    });
}
exports.ensureInputsValid = ensureInputsValid;
//# sourceMappingURL=inputs.js.map