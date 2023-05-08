import * as core from "@actions/core";
import { IActionOutputs, setOutputs } from "../src/outputs";

jest.mock("@actions/core");

describe("setOutputs", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should set all outputs", () => {
        const data: IActionOutputs = {
            "hello-message": "hello",
        };
        jest.spyOn(core, "setOutput");

        setOutputs(data, false);

        for (let key of Object.keys(data))
            expect(core.setOutput).toHaveBeenCalledWith(key, data[key]);
    });

    it("should log all outputs", () => {
        const data: IActionOutputs = {
            "hello-message": "hello",
        };
        const infoMock = jest.spyOn(core, "info");

        setOutputs(data, true);

        for (let key of Object.keys(data))
            expect(infoMock).toHaveBeenCalledWith(`${key}: ${data[key]}`);
    });
});
