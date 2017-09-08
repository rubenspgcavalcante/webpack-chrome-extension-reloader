# Webpack Chrome Extension Reloader
[![npm version](https://badge.fury.io/js/webpack-chrome-extension-reloader.svg)](https://badge.fury.io/js/webpack-chrome-extension-reloader)
[![Build Status](https://travis-ci.org/rubenspgcavalcante/webpack-chrome-extension-reloader.svg?branch=master)](https://travis-ci.org/rubenspgcavalcante/webpack-chrome-extension-reloader)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/b93aa8303bfb44a2a621cac57639ca26)](https://www.codacy.com/app/rubenspgcavalcante/webpack-chrome-extension-reloader?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=rubenspgcavalcante/webpack-chrome-extension-reloader&amp;utm_campaign=Badge_Grade)

A Webpack plugin to enable hot reloading while developing Chrome extensions.

## Solution for ...
Have your ever being annoyed while developing a Google Chrome extension, and being unable to use
webpack-hot-server because it's not a web app but a browser extension?

Well, now you can do hot reloading!

## What it does?
Basically something similar to what the webpack hot reload middleware does. When you change the code and the webpack
trigger and finish the compilation, your extension is notified and then reloaded using the chrome.runtime API.  Check out
[Hot reloading Chrome extensions using Webpack](https://medium.com/front-end-hacking/hot-reloading-extensions-using-webpack-cdfa0e4d5a08) for more background.

## Warning!
This plugin still under development, so maybe some features are missing. Of course, it's open to any PR's to improve that!

## How to use

Add `webpack-chrome-extension-reloader` to the plugins section of your webpack configuration file.
```js
const ChromeExtensionReloader  = require('webpack-chrome-extension-reloader');

plugins: [
    new ChromeExtensionReloader() // ONLY USE IT IN DEVELOPMENT BUILD!
]
```

You can also set some options (the following are the default ones):
```js
plugins: [
    new ChromeExtensionReloader({
      port: 9090, // Which port use to create the server
      reloadPage: true, // Force the reload of the page also
      entries: { //The entries used for the content/background scripts
        contentScript: 'content-script',
        background: 'background'
      }
    })
],
entry: {
    'content-script': './my-content-script.js',
    background: './my-background-script.js'
}
```

**Note:**
You must have both background and content scripts for this plugin to work, and they must be specified in separate `entry` chunks
in your webpack config.

You can find an example extension project configuration in the `sample` folder of this repo.

### License
This project is under the [MIT LICENSE](http://opensource.org/licenses/MIT)
