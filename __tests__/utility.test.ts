import * as core from "@actions/core";
import * as exec from "@actions/exec";
import {
    areKeysValid,
    execCommand,
    findRepetitiveItems,
    getBooleanInputOrDefault,
    getInputOrDefault,
} from "../src/utility";
import { mockGetExecOutput, mockGetInput } from "./mocks.utility";

describe("getInputOrDefault", () => {
    jest.mock("@actions/core");

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should return input data", () => {
        jest.spyOn(core, "getInput").mockImplementation(
            (name: string, options?: core.InputOptions | undefined) =>
                mockGetInput(name, { test: "test-value" }, options)
        );

        const input = getInputOrDefault("test", "default");

        expect(input).toBe("test-value");
    });

    it("should return default value", () => {
        jest.spyOn(core, "getInput").mockImplementation(
            (name: string, options?: core.InputOptions | undefined) =>
                mockGetInput(name, [{ key: "test", value: "" }], options)
        );

        const input = getInputOrDefault("test", "default");

        expect(input).toBe("default");
    });
});

describe("getBooleanInputOrDefault", () => {
    jest.mock("@actions/core");

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should return default value", () => {
        jest.spyOn(core, "getInput").mockImplementation(
            (name: string, options?: core.InputOptions | undefined) =>
                mockGetInput(name, [{ key: "test", value: "" }], options)
        );

        const input = getBooleanInputOrDefault("test", true);

        expect(input).toBe(true);
    });

    it("should return true", () => {
        jest.spyOn(core, "getInput").mockImplementation(
            (name: string, options?: core.InputOptions | undefined) =>
                mockGetInput(
                    name,
                    {
                        test1: "true",
                        test2: "TruE",
                    },
                    options
                )
        );

        let input = getBooleanInputOrDefault("test1", false);
        expect(input).toBe(true);

        input = getBooleanInputOrDefault("test2", false);
        expect(input).toBe(true);
    });

    it("should return false", () => {
        jest.spyOn(core, "getInput").mockImplementation(
            (name: string, options?: core.InputOptions | undefined) =>
                mockGetInput(name, { test1: "false", test2: "fALsE" }, options)
        );

        let input = getBooleanInputOrDefault("test1", true);
        expect(input).toBe(false);

        input = getBooleanInputOrDefault("test2", true);
        expect(input).toBe(false);
    });

    it("give invalid input. expect throw error", () => {
        jest.spyOn(core, "getInput").mockImplementation(
            (name: string, options?: core.InputOptions | undefined) =>
                mockGetInput(
                    name,
                    { test1: "false", test2: "invalid" },
                    options
                )
        );

        expect(() => getBooleanInputOrDefault("test2", true)).toThrow(
            "The value of 'test2' is not valid. It must be either true or false but got 'invalid'."
        );
    });
});

describe("findRepetitiveItems", () => {
    it("give empty input, should return empty list", () => {
        expect(findRepetitiveItems([]).length).toBe(0);
    });

    it("give a list that hasn't repetitive items, should return empty list", () => {
        expect(findRepetitiveItems(["a", "b", "c", "d"]).length).toBe(0);
    });

    it("give a list that has repetitive items, should return repetitive items", () => {
        const repetitiveItems = findRepetitiveItems([
            "a",
            "b",
            "c",
            "d",
            "b",
            "c",
        ]);

        expect(repetitiveItems.join(" ")).toBe("b c");
    });
});

describe("areKeysValid", () => {
    it("give valid keys", () => {
        expect(areKeysValid(["key1", "key2"], [])).toBe(true);
        expect(areKeysValid(["key1", "key2"], ["key1"])).toBe(true);
        expect(areKeysValid(["key1", "key2"], ["key1", "key2"])).toBe(true);
    });

    it("give invalid keys", () => {
        expect(areKeysValid(["key1", "key2"], ["invalid"])).toBe(false);
        expect(areKeysValid(["key1", "key2"], ["key1", "invalid"])).toBe(false);
        expect(
            areKeysValid(["key1", "key2"], ["key1", "key2", "invalid"])
        ).toBe(false);
    });
});

describe("execCommand", () => {
    jest.mock("@actions/exec");

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test("should execute command successfully", async () => {
        jest.spyOn(exec, "getExecOutput").mockImplementation(command =>
            mockGetExecOutput(command, [
                {
                    command: 'echo "Hello World"',
                    success: true,
                    resolve: {
                        stdout: "Hello World",
                        stderr: "",
                        exitCode: 0,
                    },
                },
            ])
        );

        const output = await execCommand('echo "Hello World"');
        expect(output.stdout.trim()).toBe("Hello World");
        expect(output.stderr).toBeFalsy();
        expect(output.exitCode).toBe(0);
    });

    test("should throw an error when the command fails", async () => {
        jest.spyOn(exec, "getExecOutput").mockImplementation(command =>
            mockGetExecOutput(command, [])
        );

        await expect(execCommand("invalid-command")).rejects.toThrow(
            "Execute 'invalid-command' failed."
        );
    });

    test("should throw an error with custom error message when provided", async () => {
        jest.spyOn(exec, "getExecOutput").mockImplementation(command =>
            mockGetExecOutput(command, [])
        );

        const customMessage = "Custom error message";
        await expect(
            execCommand("invalid-command", customMessage)
        ).rejects.toThrow(new RegExp(customMessage));
    });
});
