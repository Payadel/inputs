<div align="center">
  <h1>Inputs GitHub Action</h1>
  <br />
  <a href="#getting-started"><strong>Getting Started »</strong></a>
  <br />
  <br />
  <a href="https://github.com/Payadel/inputs/issues/new?assignees=&labels=bug&template=BUG_REPORT.md&title=bug%3A+">Report a Bug</a>
  ·
  <a href="https://github.com/Payadel/inputs/issues/new?assignees=&labels=enhancement&template=FEATURE_REQUEST.md&title=feat%3A+">Request a Feature</a>
  .
  <a href="https://github.com/Payadel/inputs/issues/new?assignees=&labels=question&template=SUPPORT_QUESTION.md&title=support%3A+">Ask a Question</a>
</div>

<div align="center">
<br />

![CI](https://github.com/payadel/inputs/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/payadel/inputs/actions/workflows/check-dist.yml/badge.svg)](https://github.com/payadel/inputs/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/payadel/inputs/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/payadel/inputs/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

[![code with love by Payadel](https://img.shields.io/badge/%3C%2F%3E%20with%20%E2%99%A5%20by-Payadel-ff1414.svg?style=flat-square)](https://github.com/Payadel)
[![Pull Requests welcome](https://img.shields.io/badge/PRs-welcome-ff69b4.svg?style=flat-square)](https://github.com/Payadel/inputs/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)
![GitHub](https://img.shields.io/github/license/Payadel/Inputs)

</div>

# Inputs GitHub Action

The **Inputs GitHub Action** helps manage the inputs for your GitHub Actions more effectively.

## Why Use This Action?

This action solves common issues with input management in GitHub Actions:

### Problem 1: Inconsistent Input Defaults

Some GitHub Actions need variable inputs, especially with `workflow_dispatch` to allow manual triggering. This lets you
set **default values** for inputs used in manual runs.

However, when an action is triggered by events other than `workflow_dispatch`, these defaults don't carry over. Managing
inputs that work both for manual and automatic triggers becomes tricky.

**Solution:** This action provides a simple way to set inputs and defaults through a `YAML` structure. When triggered
manually, it uses `workflow_dispatch` inputs. When triggered by other events, it falls back to the specified defaults,
ensuring consistent input values.

### Problem 2: Tracking Inputs for Debugging

For debugging, it’s useful to log the inputs an action received. Logging these manually can be tedious and prone to
errors.

**Solution:** This action automatically logs both `workflow_dispatch` inputs and YAML-specified defaults, simplifying
tracking and debugging.

### Problem 3: Access to Extra Information

Sometimes, we need more than just input variables. You might want details like the branch name, read file contents, or
execute shell commands to use their results in later steps.

**Solution:** This action lets you run commands within GitHub, log results, and pass these values to the next steps. 😎

## Purpose

The **Inputs GitHub Action** simplifies input management by allowing you to set inputs and defaults easily in YAML. It’s
designed to make handling inputs across different events straightforward.

## Built With

This action is developed using **TypeScript** and the GitHub Actions API, specifically leveraging `@actions/core`
and `@actions/github` packages to interact with GitHub Actions and its runtime environment.

## Getting Started

### Prerequisites

To use the Inputs GitHub Action, you will need a GitHub repository with a GitHub Actions workflow file. You will also
need to be familiar with `YAML` syntax and have a basic understanding of how to define GitHub Actions workflows.

## Usage

To use the Inputs GitHub Action, you will need to add it to your GitHub Actions workflow file. Here's an example of how
to use the action:

```yaml
name: My Workflow

on:
  push:
    branches:
      - main
  workflow_dispatch:
    inputs:
      my_input:
        description: 'My input description.'
        default: 'my default value'

jobs:
  my_job:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Inputs
        uses: payadel/inputs@v1  # Ensure is latest
        id: inputs
        with:
          log-inputs: true  # Default is true
          inputs: |
            - name: 'my_input'
              default: 'my default value'
              label: 'my sample input'  # Label is for logging and it is optional. If is not provided we use variable name

            - name: current-branch-name  # Define new variable and save result of below command
              default: '$(git rev-parse --abbrev-ref HEAD)'  # Returns current branch name. For example: `main`

            - name: file-content  
              default: '$(cat my-file.txt)'  # Read `my-file.txt` and save contents in `file-content` variable
              skipCommands: false  # Default is false.

      # How use inputs?
      # Samples:
      #   ${{ steps.inputs.outputs.my_input }}
      #   ${{ steps.inputs.outputs.current-branch-name }}
      #   ${{ steps.inputs.outputs.file-content }}

```

### Explanation

1. **Inputs Declaration**:

- `workflow_dispatch` allows manual runs with `my_input`, which has a default value (`my default value`). This action
  also supports automatic `push` triggers on `main`.

2. **Using the Inputs Action**:

- The `Inputs` step uses the `payadel/inputs@v1` action to manage and log inputs.
- The `with` field specifies `inputs`, each with a `name`, `default` value, and optional `label` for better log
  readability.

3. **Defining Dynamic Values**:

- `current-branch-name`: Stores the branch name dynamically by executing `git rev-parse`.
- `file-content`: Reads and stores contents of `my-file.txt`, making it accessible in later steps.

4. **Accessing the Inputs**:

- You can retrieve any input within other steps using `${{ steps.inputs.outputs.variable_name }}`, such as:
    - `${{ steps.inputs.outputs.my_input }}`
    - `${{ steps.inputs.outputs.current-branch-name }}`
    - `${{ steps.inputs.outputs.file-content }}`

This setup simplifies input management and provides flexible, accessible variables for use throughout the workflow.

### Documentation

| Input        | Description                      | Default             | Required |
|--------------|----------------------------------|---------------------|----------|
| `inputs`     | Inputs in YAML format            | `''` (empty string) | `false`  |
| `log-inputs` | Whether or not to log the inputs | `'true'`            | `false`  | 
| `verbose`    | log more data or not?            | `'false'`           | `false`  | 

The `inputs` input allows you to specify the inputs for your workflow in `YAML` format. The default value is an empty
string, which means that no inputs will be specified unless you provide them.

The `log-inputs` input determines whether or not the inputs will be logged to the GitHub Actions log. The default value
is `'true'`, which means that the inputs will be logged by default. If you don't want the inputs to be logged, you can
set this input to `'false'`.

#### Yaml Structure

| Field Name   | Data Type          | Description                                                                        |
|--------------|--------------------|------------------------------------------------------------------------------------|
| name         | string             | The name of the variable.                                                          |
| default      | string             | The default value for the variable.                                                |
| label        | string (optional)  | The label for the variable in logging.                                             |
| skipCommands | boolean (optional) | Set this to `true` to skip processing text commands. The default value is `false`. |

#### Add Command

Suppose you want to log the branch in which the action was executed or use it in the next steps. For this, you can use
the Git command `git rev-parse --abbrev-ref HEAD'`.
This action has the ability to execute your commands. In order for the action to recognize your command, you must put
the commands with `$(command)` structure. This action executes the command by default and replaces the output with the
command.
For example:
result of `The current branch is: $(git rev-parse --abbrev-ref HEAD).` is `The current branch is: main.`

If you want to disable this feature, you can set `skipCommands` to true.

## CHANGELOG

PLease see the [CHANGELOG.md](CHANGELOG.md) file.

## Features

- Easily manage GitHub action inputs with a **simple** and convenient YAML structure.
- Set default values for inputs that will be used if no input is provided or if the action is executed with other
  events.
- Log inputs for debugging and future reference without any extra effort or configuration.
- Works seamlessly with `workflow_dispatch` inputs for manual execution.
- Compatible with any GitHub Actions workflow.

## Roadmap

See the [open issues](https://github.com/Payadel/inputs/issues) for a list of proposed features (and known
issues).

- [Top Feature Requests](https://github.com/Payadel/inputs/issues?q=label%3Aenhancement+is%3Aopen+sort%3Areactions-%2B1-desc) (
  Add your votes using the 👍 reaction)
- [Top Bugs](https://github.com/Payadel/inputs/issues?q=is%3Aissue+is%3Aopen+label%3Abug+sort%3Areactions-%2B1-desc) (
  Add your votes using the 👍 reaction)
- [Newest Bugs](https://github.com/Payadel/inputs/issues?q=is%3Aopen+is%3Aissue+label%3Abug)

## Support

Reach out to the maintainer at one of the following places:

- [GitHub issues](https://github.com/Payadel/inputs/issues/new?assignees=&labels=question&template=SUPPORT_QUESTION.md&title=support%3A+)

## FAQ

### Q: How do I specify inputs with this action?

A: To specify inputs, use the `inputs` parameter in a `YAML` structure. Each entry should include two main keys:

- **`name`**: the variable name
- **`default`**: the default value for the variable (can be an empty string but must be defined)

> Note: Inputs provided through `workflow_dispatch` take **priority** if they exist.

Refer to the [Getting Started](#getting-started) section for an example.

### Q: What happens if I don’t specify any inputs?

A: The action checks both `workflow_dispatch` inputs and those defined directly in the `YAML` inputs. If only one source
is available, it uses those values; if neither source has inputs, then no inputs will appear in the output.

> Reminder: `workflow_dispatch` inputs are only available when the action is triggered manually.

### Q: When should I define inputs directly in the action?

A: If the action will **only** run manually, it isn’t necessary to define inputs in the action, as they can all be
passed through `workflow_dispatch`. However, if the action might run automatically (triggered by events other
than `workflow_dispatch`), we recommend defining all inputs directly in the action to ensure they are always available.

### Q: Can I still use `workflow_dispatch` inputs with this action?

A: Absolutely! This action is compatible with `workflow_dispatch` inputs, so you can still use them for manual execution
when needed.

### Q: How do I log the inputs?

A: Inputs are logged automatically by default. To disable input logging, set the `log-inputs` parameter to `'false'`.
For more details, see the [Getting Started](#getting-started) section.

### Q: Can I use this action in any GitHub Actions workflow?

A: Yes! This action is fully compatible with all GitHub Actions workflows, so you can use it seamlessly in any workflow
you create or use.

## Contributing

First off, thanks for taking the time to contribute! Contributions are what make the free/open-source community such an
amazing place to learn, inspire, and create. Any contributions you make will benefit everybody else and are **greatly
appreciated**.

Please read [our contribution guidelines](docs/CONTRIBUTING.md), and thank you for being involved!

## Authors & contributors

The original setup of this repository is by [Payadel](https://github.com/Payadel).

For a full list of all authors and contributors,
see [the contributors page](https://github.com/Payadel/inputs/contributors).

## Security

This project follows good practices of security, but 100% security cannot be assured. This project is provided **"as
is"** without any **warranty**.

_For more information and to report security issues, please refer to our [security documentation](docs/SECURITY.md)._

## License

This project is licensed under the **GPLv3**.

See [LICENSE](LICENSE) for more information.
