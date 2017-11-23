import { Plugin } from "webpack";

abstract class AbstractChromePluginReloader implements Plugin {
  context: any;

  abstract apply(options?: any);
}

export default AbstractChromePluginReloader;
