import { executeCommands } from '../src/execCommands'
import * as exec from '@actions/exec'
import { mockGetExecOutput } from './mocks.utility'

describe('executeCommands', () => {
  jest.mock('@actions/exec')

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("give string that hasn't any command.", async () => {
    await expect(
      executeCommands("this is a text that hasn't any command.")
    ).resolves.toBe("this is a text that hasn't any command.")
  })

  it('give string that has commands.', async () => {
    jest.spyOn(exec, 'getExecOutput').mockImplementation(command =>
      mockGetExecOutput(command, [
        {
          command: 'git rev-parse --abbrev-ref HEAD',
          success: true,
          resolve: {
            stdout: 'main',
            stderr: '',
            exitCode: 0
          }
        },
        {
          command: 'echo hello',
          success: true,
          resolve: {
            stdout: 'hello',
            stderr: '',
            exitCode: 0
          }
        }
      ])
    )

    await expect(
      executeCommands(
        'The branch name is: $(git rev-parse --abbrev-ref HEAD) and result of echo is: $(echo hello).'
      )
    ).resolves.toBe('The branch name is: main and result of echo is: hello.')
  })
})
