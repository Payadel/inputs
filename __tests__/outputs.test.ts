import * as core from "@actions/core";
import { setOutputs } from "../src/outputs";
import { IYamlInput } from "../src/inputs";

jest.mock("@actions/core");

describe("setOutputs", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should set all outputs", () => {
        const outputs: IYamlInput[] = [
            {
                name: "hello-message",
                default: "hello",
                label: "hello message",
            },
        ];
        jest.spyOn(core, "setOutput");

        setOutputs(outputs, false);

        for (let output of outputs)
            expect(core.setOutput).toHaveBeenCalledWith(
                output.name,
                output.default
            );
    });

    it("should log all outputs", () => {
        const outputs: IYamlInput[] = [
            {
                name: "hello-message",
                default: "hello",
                label: "hello message",
            },
            {
                name: "hi-message",
                default: "hi",
                label: "hi message",
            },
        ];
        const infoMock = jest.spyOn(core, "info");

        setOutputs(outputs, true);

        for (let output of outputs) {
            const key = output.label ? output.label : output.name;
            expect(infoMock).toHaveBeenCalledWith(`${key}: ${output.default}`);
        }
    });
});
