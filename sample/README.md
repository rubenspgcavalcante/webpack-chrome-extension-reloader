# Example of Plugin using WCER

I this directory you can see a example of plugin project using Webpack and the webpack-chrome-extension-reloader.

# How it works
First run `yarn sample` on the root of this project, this will trigger the webpack using the configuratuion withim `webpack.plugin.js`.
On chrome extensions, switch to "development mode" and add a "unpacked" extension. The choose the **dist** directory.
Open a new tab on any site (can't be the home page), open the debugger and you're going to see some *log* from the content-script of the plugin plus a message from the extension hot reload server:
```
[ WCER: Connected to Chrome Extension Hot Reloader ]
```
Change anything inside `plugin-src` and look the page reload it automatically, using the new version of your extension.  
Tip: try to change the content of the console log within the `my-content-script`, and see the page reload and show the new result.

## Why can't I load plugin-src/ dir?
The source needs to be parsed and bundled by Webpack, then is outputed on the `dist` directory. This means
you can't directly load this directory as a extension.
The source in dist will contain the neccessary data to make the Hot Reloading work properly.

## Running Webpack in watch mode
As Chrome is the "server" of our files, we don't need to run any server other than the one created by
the WCER intself. Don't worry, it creates with no, just by using the plugin it will take care for you.
All you need to do is run your webpack with the `--watch` option enabled, and everytime any change happens
Webpack will rebuild all for you, triggering the WCER plugin, signing the extension to be reloaded.

## Manifest and Icons
As both manifest.json and icons aren't directly processed on the extension source, it needs to be
copied to the final output directory `dist/`. So, if you check the `webpack.plugin.js` configuration you can
see the [CopyWebpackPlugin](https://github.com/webpack-contrib/copy-webpack-plugin) being used to move both 
manifest and icons to the output directory.