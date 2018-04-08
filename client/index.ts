import { install } from "source-map-support";
import { resolve } from "path";
import { cwd } from "process";
import * as webpack from "webpack";
import * as minimist from "minimist";
import ChromeExtensionReloader from "../src/ChromeExtensionReloader";
import {
  BACKGROUND_ENTRY,
  CONFIG,
  CONTENT_SCRIPT_ENTRY,
  NO_PAGE_RELOAD,
  PORT
} from "./args.constant";
import {
  DEFAULT_BACKGROUND_ENTRY,
  DEFAULT_CONFIG,
  DEFAULT_CONTENT_SCRIPT_ENTRY,
  DEFAULT_PORT
} from "../src/constants/options.constants";

install();

const { _, ...params } = minimist(process.argv.slice(2));

const config = params[CONFIG] || DEFAULT_CONFIG;
const port = params[PORT] || DEFAULT_PORT;
const contentScript =
  params[CONTENT_SCRIPT_ENTRY] || DEFAULT_CONTENT_SCRIPT_ENTRY;
const background = params[BACKGROUND_ENTRY] || DEFAULT_BACKGROUND_ENTRY;

const pluginOptions: PluginOptions = {
  port,
  reloadPage: !params[NO_PAGE_RELOAD],
  entries: { contentScript, background }
};

const optPath = resolve(cwd(), config);
let opts: any = {};

try {
  // tslint:disable-next-line:no-eval
  opts = eval("require")(optPath);
} catch (err) {
  console.error(`[Error] Couldn't require the file: ${optPath}`);
  console.error(err);
  process.exit();
}

const compiler = webpack(
  typeof opts === "function" ? opts(process.env, process.argv) : opts
);
new ChromeExtensionReloader(pluginOptions).apply(compiler);

compiler.watch({}, (err, stats) => {
  if (err) {
    return treatErrors(err);
  }
  console.info(stats.toString({ colors: true }));
});

function treatErrors(err) {
  console.error(err.stack || err);
  if (err.details) {
    console.error(err.details);
  }
}
