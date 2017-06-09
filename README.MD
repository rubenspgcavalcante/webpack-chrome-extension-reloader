# Webpack Chrome Extension Reloader
[![npm version](https://badge.fury.io/js/webpack-chrome-extension-reloader.svg)](https://badge.fury.io/js/webpack-chrome-extension-reloader)
[![Build Status](https://travis-ci.org/rubenspgcavalcante/webpack-chrome-extension-reloader.svg?branch=master)](https://travis-ci.org/rubenspgcavalcante/webpack-chrome-extension-reloader)

A Webpack plugin to enable hot reloading while developing Chrome extensions.

## Solution for ...
Have your ever being annoyed while developing a Google Chrome extension, and being unable to use 
webpack-hot-server because it's not a web app but a browser extension?

Well, now you can do hot reloading!

## What it does?
Basically something similar to what the webpack hot reload middleware does. When you change the code and the webpack
trigger and finish the compilation, your extension is notified and then reloaded using the chrome.runtime API.
 
## Warning!
This plugin still under development, so maybe some features are missing. Of course, it's open to any PR's to improve that!

## How to use

First import the module
```js
const ChromeExtensionReloader  = require('webpack-chrome-extension-reloader');
```

And then, just add it to the plugins section of the webpack configuration file.
```js
plugins: [
    new ChromeExtensionReloader() // ONLY USE IT IN DEVELOPMENT BUILD!
]
```

You can also inform some options (the following are the default ones):
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
]
```

### License
This project is under the [MIT LICENSE](http://opensource.org/licenses/MIT)