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

1. Clone the repository.
2. Create an access token from your [gitlab settings](https://gitlab.com/profile/personal_access_tokens). You need to grant it access to `api`, `read_user`, `read_repository` and `read_registry`.
3. Copy the `env.sample.js` file to `env.js` and replace the default empty string for token option with your token (for self-hosted servers change the baseUrl option to match your domain).
4. Use an http server to run the application. There's no build steps required and you don't even need to install the required modules.

## Status of this project

This is still work in progress. As a start I am focusing on using the APIs to build useful reports. After extracting enough useful information from the data I plan to rebuild the dashboard and display these information in a better way.

## ⚠️ WARNING ⚠️

This tool require a Gitlab access token to work. That token should be kept safe and hidden. If you deploy it there is a possibility that someone find it and use it to do harm to your work. **Use it at your own risk**.
