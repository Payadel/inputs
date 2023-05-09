"use strict";
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
exports.executeCommands = exports.COMMAND_REGEX = void 0;
const utility_1 = require("./utility");
exports.COMMAND_REGEX = /\$\((.*?)\)/g;
function executeCommands(str) {
    return __awaiter(this, void 0, void 0, function* () {
        if (str === undefined || str === null)
            throw new Error("The str parameter is required.");
        const matches = str.match(exports.COMMAND_REGEX);
        if (!matches)
            return str;
        for (const match of matches) {
            const command = match.substring(2, match.length - 1);
            const result = yield (0, utility_1.execCommand)(command).then(output => output.stdout.trim());
            str = str.replace(match, result);
        }
        return str;
    });
}
exports.executeCommands = executeCommands;
//# sourceMappingURL=execCommands.js.map