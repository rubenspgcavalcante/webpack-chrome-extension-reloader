import { install } from "source-map-support";
import * as minimist from "minimist";
import argsParser from "./args-parser";
import { SIG_EXIT } from "./events.constants";
import ExtensionCompiler from "./ExtensionCompiler";

install();
const { _, ...args } = minimist(process.argv.slice(2));

try {
  const { webpackConfig, pluginOptions } = argsParser(args);
  const compiler = new ExtensionCompiler(webpackConfig, pluginOptions);
  compiler.watch();
} catch (err) {
  if (err.type === SIG_EXIT) {
    process.exit(err.payload);
  } else {
    console.error(err);
    process.exit(err.code);
  }
}
