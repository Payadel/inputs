import * as core from "@actions/core";
import { getInputs, IInputs, VALID_YAML_KEYS } from "../src/inputs";
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

        const inputs: IInputs = await getInputs(DEFAULT_INPUTS);

        expect(inputs.logInputs).toBe(DEFAULT_INPUTS.logInputs);
        expect(inputs.yamlInputs).toBe(DEFAULT_INPUTS.yamlInputs);
    });

    it("yaml input is not valid, so should reject", async () => {
        jest.spyOn(core, "getInput").mockImplementation(
            (name: string, options?: core.InputOptions | undefined) =>
                mockGetInput(name, { inputs: "invalid yaml" }, options)
        );
        await expect(getInputs(DEFAULT_INPUTS)).rejects.toThrow(
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
        await expect(getInputs(DEFAULT_INPUTS)).rejects.toThrow(
            `The 'default' parameter is required.
Item:
\t{"name":"param"}`
        );
    });

    it("yaml keys are not valid, so should reject", async () => {
        jest.spyOn(core, "getInput").mockImplementation(
            (name: string, options?: core.InputOptions | undefined) =>
                mockGetInput(
                    name,
                    {
                        inputs: `
- name: valid
  default: valid
- name: invalid
  default: invalid
  invalid-key: invalid
                `,
                    },
                    options
                )
        );
        await expect(getInputs(DEFAULT_INPUTS)).rejects.toThrow(
            `Yaml keys are not valid. It has unexpected key(s).
Item Keys: name, default, invalid-key
Valid keys: ${VALID_YAML_KEYS.join(", ")}`
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

        await expect(getInputs(DEFAULT_INPUTS)).rejects.toThrow(
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

        await expect(getInputs(DEFAULT_INPUTS)).resolves;
    });

    it("the default key is exist but empty, should resolve", async () => {
        jest.spyOn(core, "getInput").mockImplementation(
            (name: string, options?: core.InputOptions | undefined) =>
                mockGetInput(
                    name,
                    {
                        inputs: `
- name: 'param1'
  default: 'value1'
- name: 'param2'
  default: ''
    `,
                    },
                    options
                )
        );

        await expect(getInputs(DEFAULT_INPUTS)).resolves;
    });
});
