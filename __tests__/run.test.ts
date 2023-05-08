import run from "../src/run";
import * as core from "@actions/core";
import * as github from "@actions/github";

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
        await run();

        // Assert
        expect(setOutputMock).toHaveBeenCalledWith("input1", "value1");
        expect(infoMock).toHaveBeenCalledWith("input1: value1");

        expect(setOutputMock).toHaveBeenCalledWith("input2", "value2");
        expect(infoMock).toHaveBeenCalledWith("input2: value2");
    });
});
