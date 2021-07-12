# Gitlab Explorer

Gitlab Explorer is a tool to visualize your groups, repositories, members and activities in your Gitlab space.

## About

This is a side project I started as an attempt to try different technologies like [snowpack](https://www.snowpack.dev/), [Dixie](https://dexie.org/) and [lit-html](https://lit-html.polymer-project.org/). I found it useful so I decided to share it. It collects data from your gitlab account and store it in the browser using [IndexdDb](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API).

With this tool you can check:

* Your groups.
* Projects in your groups and their last activiy.
* Members in your groups and projects and their activities.
* Draw graphs using user activities.

Since everything is stored in your browser, you might want to export the data somewhere to import it again if you want to share it with someone.

## Getting started

**Note: make sure to use the latest version of Chrome and enable the experamintal javascript flag from `chrome://flags`, this is important since some of the javascript used here are still not official yet**

1. Create a `env.js` file and copy the contents of `env.sample.js` to it, replace the `token` and/or the `baseUrl` with your own gitlab instance configurations.
   * you can create a personal access token from your gitlab settings and make sure to allow `api`, `read_user`, `read_repository` and `read_registry` access for that token.
2. Start a server from the project directory, the project should now be running in your browser, this project uses [snowpack](https://www.snowpack.dev/) so no building/bundling is required.

## Status of this project

This is still work in progress. As a start I am focusing on using the APIs to build useful reports. After extracting enough useful information from the data I plan to rebuild the dashboard and display these information in a better way.

## ⚠️ WARNING ⚠️

This tool require a Gitlab access token to work. That token should be kept safe and hidden. If you deploy it there is a possibility that someone find it and use it to do harm to your work. **Use it at your own risk**.
