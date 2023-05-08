export function assertOutput(
    inputs: { [key: string]: string },
    setOutputMock,
    infoMock?
) {
    if (!setOutputMock) throw new Error("setOutputMock is required.");

    for (const key in inputs) {
        expect(setOutputMock).toHaveBeenCalledWith(key, inputs[key]);
        if (infoMock)
            expect(infoMock).toHaveBeenCalledWith(`${key}: ${inputs[key]}`);
    }
}
