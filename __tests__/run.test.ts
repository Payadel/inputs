import run from "../src/run";
import * as core from "@actions/core";
import * as github from "@actions/github";
import { mockGetInput } from "./mocks.utility";
import { assertOutput } from "./asserts.utility";

jest.mock("@actions/core");
jest.mock("@actions/github");

describe("run", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("when not any inputs provided, should resolve successful", async () => {
        // Arrange
        const infoMock = jest.spyOn(core, "info");
        const errorMock = jest.spyOn(core, "error");
        const setFailedMock = jest.spyOn(core, "setFailed");

        // Act
        await run();

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

        const inputsPayload = {
            input1: "value1",
            input2: "value2",
        };
        (github.context.payload.inputs as any) = inputsPayload;

        // Act
        await expect(run()).resolves;

        // Assert
        assertOutput(inputsPayload, setOutputMock, infoMock);
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
        await expect(run()).resolves;

        // Assert
        assertOutput(
            { param1: "value1", param2: "value2" },
            setOutputMock,
            infoMock
        );
    });
});
