import { IYamlInput } from "../src/inputs";

export function assertOutput(inputs: IYamlInput[], setOutputMock, infoMock?) {
    if (!setOutputMock) throw new Error("setOutputMock is required.");

    for (const input of inputs) {
        expect(setOutputMock).toHaveBeenCalledWith(input.name, input.default);
        if (infoMock) {
            const label = input.label ? input.label : input.name;
            expect(infoMock).toHaveBeenCalledWith(`${label}: ${input.default}`);
        }
    }
}
