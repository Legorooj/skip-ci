# skip-ci

Allows your GitHub actions workflow to easily skip jobs when a match for a given regex is found in the commit message.

Unlike other CI providers (such as Travis CI, AppVeyor, CircleCI, Azure Pipelines, and more), GitHub actions does not support any form of using `[skip ci]` in the commit message. This action attempts to fix this problem, by providing an easy to use method of checking for a pattern in the commit message.

## Inputs

### Token

The GitHub token used to authenticate GitHub API requests. This defaults to [`github.token`](https://docs.github.com/en/free-pro-team@latest/actions/reference/authentication-in-a-workflow), and you should not need to provide it.

### Pattern

The RegEx pattern which the commit message is searched for.

The default pattern will match `[skip <KEYWORD>]` or `[<KEYWORD> skip]`, where `KEYWORD` is one of `actions`, `ga`, or `ci`. It will also match if there is a hyphen (`-`) between `KEYWORD` and `skip`.

Please note that only the `HEAD` commit will be checked for this pattern.


## Outputs

* `canSkip`: string, either `true` or `false`


## Usage

### Skip whole jobs

```yml
jobs:

  skip_ci:
    runs-on: ubuntu-latest
    # Map the output to the job's outputs
    outputs:
      canSkip: ${{ steps.check.outputs.canSkip }}
    steps:
      - id: check
        uses: Legorooj/skip-ci@main
        # with:
        #   pattern: MyCustomRegExPattern
        #   token: ${{ github.token }}
  build:
    # Wait for the skip_ci job to run
    needs: skip_ci
    # And only run the build if canSkip isn't 'true'.
    if: ${{ needs.skip_ci.outputs.canSkip != 'true' }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Hello world!
        run: echo Hello, world!
```

### Skip Individual steps

```yml
steps:
  - id: skip_ci
    uses: Legorooj/skip-ci@main
    # with:
    #   pattern: MyCustomRegExPattern
    #   token: ${{ github.token }}
  - if: ${{ steps.skip_ci.outputs.canSkip != 'true' }}
    name: Hello world!
    run: echo Hello, world!
```

## Credits

* [@BoboTiG](https://github.com/BoboTiG) inspired me to write this. Thanks! 
