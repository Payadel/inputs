import * as core from "@actions/core";
import { getInputs, IInputs } from "../src/inputs";
import { mockGetInput } from "./mocks.utility";
import { DEFAULT_INPUTS } from "../src/configs";

jest.mock("@actions/core");

describe("getInputs", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("default inputs", async () => {
        jest.spyOn(core, "getInput").mockImplementation(
            (name: string, options?: core.InputOptions | undefined) =>
                mockGetInput(name, {}, options)
        );

        const inputs: IInputs = await getInputs();

        expect(inputs.logInputs).toBe(DEFAULT_INPUTS.logInputs);
        expect(inputs.yamlInputs).toBe(DEFAULT_INPUTS.yamlInputs);
    });

    it("yaml input is not valid, so should reject", async () => {
        jest.spyOn(core, "getInput").mockImplementation(
            (name: string, options?: core.InputOptions | undefined) =>
                mockGetInput(name, { inputs: "invalid yaml" }, options)
        );
        await expect(getInputs()).rejects.toThrow(
            "The 'name' parameter is required."
        );

        jest.spyOn(core, "getInput").mockImplementation(
            (name: string, options?: core.InputOptions | undefined) =>
                mockGetInput(
                    name,
                    {
                        inputs: `
                                    - name: param
                                `,
                    },
                    options
                )
        );
        await expect(getInputs()).rejects.toThrow(
            `The 'default' parameter is required.
Item:
\t{"name":"param"}`
        );
    });

    it("give repetitive input name", async () => {
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
- name: 'param1'
  default: 'value2'
    `,
                    },
                    options
                )
        );

        await expect(getInputs()).rejects.toThrow(
            `Repetitive keys is not allowed: param1`
        );
    });

    it("give valid inputs", async () => {
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

        await expect(getInputs()).resolves;
    });
});
