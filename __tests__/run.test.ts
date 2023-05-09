import run from "../src/run";
import * as core from "@actions/core";
import * as github from "@actions/github";
import { mockGetExecOutput, mockGetInput } from "./mocks.utility";
import { assertOutput } from "./asserts.utility";
import { DEFAULT_INPUTS } from "../src/configs";
import * as exec from "@actions/exec";

jest.mock("@actions/core");
jest.mock("@actions/github");
jest.mock("@actions/exec");

describe("run", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("not any inputs provided, should resolve successful", async () => {
        // Arrange
        const infoMock = jest.spyOn(core, "info");
        const errorMock = jest.spyOn(core, "error");
        const setFailedMock = jest.spyOn(core, "setFailed");

        const defaultInputs = DEFAULT_INPUTS;
        defaultInputs.verbose = true;

        // Act
        await run(defaultInputs);

        // Assert
        expect(infoMock).toBeCalledTimes(1);
        expect(infoMock).toHaveBeenCalledWith(
            `Operation completed successfully.`
        );

        expect(errorMock).not.toHaveBeenCalled();
        expect(setFailedMock).not.toHaveBeenCalled();
    });

    it("should get inputs from github context", async () => {
        // Arrange
        const setOutputMock = jest.spyOn(core, "setOutput");
        const infoMock = jest.spyOn(core, "info");

        (github.context.payload.inputs as any) = {
            input1: "value1",
            input2: "value2",
        };

        // Act
        await run(DEFAULT_INPUTS);

        // Assert
        assertOutput(
            [
                {
                    name: "input1",
                    default: "value1",
                },
                {
                    name: "input2",
                    default: "value2",
                },
            ],
            setOutputMock,
            infoMock
        );
    });

    it("should process yaml inputs", async () => {
        // Arrange
        const setOutputMock = jest.spyOn(core, "setOutput");
        const infoMock = jest.spyOn(core, "info");
        jest.spyOn(core, "getInput").mockImplementation(
            (name: string, options?: core.InputOptions | undefined) =>
                mockGetInput(
                    name,
                    {
                        inputs: `
- name: 'param1'
  default: 'value1'
- name: 'param2'
  default: 'value2'
    `,
                    },
                    options
                )
        );

        // Act
        await run(DEFAULT_INPUTS);

        // Assert
        assertOutput(
            [
                {
                    name: "param1",
                    default: "value1",
                },
                {
                    name: "param2",
                    default: "value2",
                },
            ],
            setOutputMock,
            infoMock
        );
    });

    it("give yaml and github context", async () => {
        // Arrange
        const setOutputMock = jest.spyOn(core, "setOutput");
        const infoMock = jest.spyOn(core, "info");
        jest.spyOn(core, "getInput").mockImplementation(
            (name: string, options?: core.InputOptions | undefined) =>
                mockGetInput(
                    name,
                    {
                        inputs: `
- name: 'param1'
  default: 'value1'
- name: 'param2'
  default: 'value2'
- name: 'commonInput'
  default: 'yaml'
  label: 'common input'
    `,
                    },
                    options
                )
        );
        (github.context.payload.inputs as any) = {
            input1: "value1",
            input2: "value2",
            commonInput: "github",
        };

        // Act
        await run(DEFAULT_INPUTS);

        // Assert
        assertOutput(
            [
                {
                    name: "input1",
                    default: "value1",
                },
                {
                    name: "input2",
                    default: "value2",
                },
                {
                    name: "param1",
                    default: "value1",
                },
                {
                    name: "param2",
                    default: "value2",
                },
                {
                    name: "commonInput",
                    default: "github",
                    label: "common input",
                },
            ],
            setOutputMock,
            infoMock
        );
    });

    it("give text that has command", async () => {
        // Arrange
        jest.spyOn(exec, "getExecOutput").mockImplementation(command =>
            mockGetExecOutput(command, [
                {
                    command: "git rev-parse --abbrev-ref HEAD",
                    success: true,
                    resolve: {
                        stdout: "main",
                        stderr: "",
                        exitCode: 0,
                    },
                },
            ])
        );

        const setOutputMock = jest.spyOn(core, "setOutput");
        jest.spyOn(core, "getInput").mockImplementation(
            (name: string, options?: core.InputOptions | undefined) =>
                mockGetInput(
                    name,
                    {
                        inputs: `
- name: 'command'
  default: 'The current branch is $(git rev-parse --abbrev-ref HEAD).'
- name: 'skip-command'
  default: 'do not execute this command: $(git rev-parse --abbrev-ref HEAD)'
  skipCommands: true
    `,
                    },
                    options
                )
        );

        // Act
        await run(DEFAULT_INPUTS);

        // Assert
        assertOutput(
            [
                {
                    name: "command",
                    default: "The current branch is main.",
                },
                {
                    name: "skip-command",
                    default:
                        "do not execute this command: $(git rev-parse --abbrev-ref HEAD)",
                },
            ],
            setOutputMock
        );
    });
});
