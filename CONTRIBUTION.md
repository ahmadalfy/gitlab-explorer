# Contributing
When contributing to this repository , first make sure to discuss the change you wish to make via an [issue](https://github.com/ahmadalfy/gitlab-explorer/issues)

## Installation:
### Note: make sure to use the latest version of Chrome and enable the experamintal javascript flag from `chrome://flags`, this is important since some of the javascript used here are still not official yet.

1. Fork this repo and clone that fork from your account to your local machine.
2. Install the dependencies using `npm install`
3. Create a `env.js` file and copy the contents of `env.sample.js` to it, replace the `token` and/or the `baseUrl` with your own gitlab instance configurations.
   - you can create a personal access token from your gitlab settings and make sure to allow `api`, `read_user`, `read_repository` and `read_registry` access for that token.
4. Start a server from the project directory, the project should now be running in your browser, this project uses [snowpack](https://www.snowpack.dev/) so no building/bundling is required.

## Workflow:
- as mentioned above make sure to create an issue or grab an existing one from [here](https://github.com/ahmadalfy/gitlab-explorer/issues)
- create a branch from `master` branch, make sure that your naming convention matches `[type]/[name]`, replace the `type` with one of `feature / fix / hotfix`.
- make changes and use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) to format your commits messages.
- push your changes to your fork and create a PR on the main repo, make sure you provide a good description of your changes in the PR body and attach screenshots to any UI/UX changes you make.
- Wait for your PR to be reviewed and merged.
