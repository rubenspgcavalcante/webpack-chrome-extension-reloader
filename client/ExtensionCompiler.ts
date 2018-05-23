import * as webpack from "webpack";
import { Options } from "webpack";
import ChromeExtensionReloader from "../src/ChromeExtensionReloader";

export default class ExtensionCompiler {
  private compiler;

  constructor(config: Options.WatchOptions, pluginOptions: PluginOptions) {
    this.compiler = webpack(
      typeof config === "function" ? config(process.env, process.argv) : config
    );
    new ChromeExtensionReloader(pluginOptions).apply(this.compiler);
  }

  private static treatErrors(err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
  }

  watch() {
    this.compiler.watch({}, (err, stats) => {
      if (err) {
        return ExtensionCompiler.treatErrors(err);
      }
      console.info(stats.toString({ colors: true }));
    });
  }
}
