import * as core from "@actions/core";
import { getInputOrDefault } from "../src/utility";
import { mockGetInput } from "./mocks.utility";

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
