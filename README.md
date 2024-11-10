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

## About

The `Inputs GitHub Action` is a tool that helps you manage inputs of your GitHub Action in a better way.

### What problem does it solve?

This action solves two main problems:

#### Problem 1:

Some GitHub Actions require variables that can be changed through `workflow_dispatch` inputs.
By defining the `workflow_dispatch`, we can execute the GitHub Action manually and
specify inputs for it, as well as **set default values** for inputs.

However, sometimes we need our GitHub Action to run **both** manually and with other events.
The Default values of `workflow_dispatch` only exist when the action is executed **manually**,
and will not be set if the action is executed with other events.
it can be difficult to manage inputs in a way that is both convenient and safe.

**Solution:** With this action, you can manage inputs in a much easier and better way.
The action allows you to specify inputs and default values with a simple and convenient `YAML` structure. If the action
is executed manually, the inputs of `workflow_dispatch` are set in the output. However, if there is no input or the
action is executed with other events, the default value specified in the action is set in the output.

This GitHub Action aims to solve this problem by providing a **simple** and effective way to manage inputs.

#### Problem 2:

For future logs or debugging an action, we need to know exactly what parameters each action was executed
with. For this, it is better to **log the variables** in Action GitHub. But this will be tedious, not clean and increase
the
possibility of error.

**Solution:** To solve this problem, this action logs inputs by default (both `workflow_dispatch` inputs and those
passed to the action with the YAML structure).

#### Problem 3:

Logging inputs is not necessarily enough. Our action may be executed in different conditions. For example, it may be
important for us to know on which branch this action was performed? Or maybe we want to use the brunch name in other
steps.
Or maybe it is necessary to read a file and save it in a variable or save the result of a shell command in a variable to
use in the next steps.

**Solution:** With the help of this action, you can save any command that can be executed and accessible in GitHub, log
the result and use it easily in the next steps. 😎

### What is the purpose of your project?

The purpose of the `Inputs GitHub Action` is to help users better manage the inputs of their GitHub Actions. By
providing a simple and convenient way to specify inputs and default values using a `YAML` structure, this action aims to
simplify the process of managing inputs and improve the lives of its audience.

### Built With

The Inputs GitHub Action was built using Typescript and the GitHub Actions API. Specifically, it was created using
the `@actions/core` and `@actions/github` packages, which provide the functionality needed to interact with the GitHub
Actions runtime environment and the GitHub API.

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
        uses: payadel/inputs@v0.2.2  # Ensure is latest
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

This YAML code is an example of how to use this in a GitHub Actions workflow file. Here's what each section does:

- `name: My Workflow`: This sets the name of the workflow. Replace `My Workflow` with the name of your workflow.

- `on`: This section defines the events that trigger the workflow. In this example, the workflow is triggered on `push`
  events to the `main` branch and manual `workflow_dispatch` events.

- `inputs`: This section defines the inputs for the `workflow_dispatch` event. In this example, we have defined an input
  named `my_input` with a description and default value.

- `jobs`: This section defines the jobs that are run in the workflow.

- `my_job`: This sets the name of the job. Replace `my_job` with the name of your job.

- `runs-on: ubuntu-latest`: This sets the operating system that the job runs on. In this example, the job runs on
  Ubuntu.

- `steps`: This section defines the steps that are run in the job.

- `- uses: actions/checkout@v3`: This step checks out the repository code into the runner.

- `- name: Inputs`: This sets the name of the step. Replace `Inputs` with the name of your step.

- `- uses: payadel/inputs@v0.1.0`: This step uses the `Inputs` GitHub Action.

- `- id: inputs`: This sets the ID of the step. You can use this ID to reference the output of the step in later steps.

- `- with`: This section sets the inputs for the `Inputs` GitHub Action.

- `- log-inputs: true`: This enables logging of the inputs to the GitHub Actions log. The default value is `true`.

- `- inputs: |`: This section defines the inputs for the `Inputs` GitHub Action. In this example, we have defined an
  input named `my_input` with a default value.

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
This action has the ability to execute your commands. In order for the action to recognize your command, you must put the commands with `$(command)` structure. This action executes the command by default and replaces the output with the command.
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

A: You can specify inputs using the `inputs` input in `YAML` format.
Each part contains two essential keys. One `name` and one `default`.
Define the variable name in `name` key and the default value in `default` key.
The `default` key can be empty string but is required to define it.

> `workflow_dispatch` inputs are recognized by default and have **priority**.

See the [Getting Started](#getting-started) section above for an example.

### Q: What happens if I don't specify any inputs?

A: We consider `workflow_dispatch` inputs and inputs that are given as yaml.
If one of these two is not available, we will use the other.
If there is no variable in either of these two, it will not be in the output either.

> Don't forget that `workflow_dispatch` inputs will only exist when the action is executed manually.

### Q: When should define the inputs in the action?

A: If your action is always executed manually, it is not necessary to define the inputs in the action, but if there is
no `workflow_dispatch` or it is not necessarily going to be executed with `workflow_dispatch` (there are other events),
we definitely suggest defining the inputs in the action.

### Q: Can I still use `workflow_dispatch` inputs with this action?

A: Yes! This action works seamlessly with `workflow_dispatch` inputs, so you can still use them for manual execution of
your workflow.

### Q: How do I log the inputs?

A: By default, inputs are logged automatically. If you don't want to log inputs, you can set the `log-inputs` input
to `'false'`. See the [Getting Started](#getting-started) section above for an example.

### Q: Can I use this action with any GitHub Actions workflow?

A: Yes! This action is compatible with any GitHub Actions workflow, so you can use it with any workflow you create or
use.

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
