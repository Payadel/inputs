import * as core from "@actions/core";
import { getInputs, IInputs } from "../src/inputs";
import { mockGetInput } from "./mocks.utility";

jest.mock("@actions/core");

describe("getInputs", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("The log-inputs default is true, should return true", async () => {
        jest.spyOn(core, "getInput").mockImplementation(
            (name: string, options?: core.InputOptions | undefined) =>
                mockGetInput(name, { "log-inputs": "" }, options)
        );

        const inputs: IInputs = await getInputs();

        expect(inputs.logInputs).toBe(true);
    });
});
