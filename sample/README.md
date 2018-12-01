# Example of Plugin using WCER

I this directory you can see a example of plugin project using Webpack and the hot-reload.

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
you can't directly load the `plugin-src` directrory as a extension.
The source in dist will contain the neccessary data to make the Hot Reloading work properly.