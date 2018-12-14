import { merge } from "lodash";
import { ConcatSource } from "webpack-sources";
import AbstractChromePluginReloader from "./webpack/AbstractChromeExtensionReloader";
import middlewareSourceBuilder from "./utils/middleware-source-builder";
import middlewareInjector from "./utils/middleware-injector";
import changesTriggerer from "./utils/changes-triggerer";
import HotReloaderServer from "./utils/HotReloaderServer";
import defaultOptions from "./utils/default-options";
import CompilerEventsFacade from "./utils/CompilerEventsFacade";
import { onlyOnDevelopmentMsg } from "./messages/warnings";
import { bgScriptRequiredMsg } from "./messages/errors";
import { warn } from "./utils/logger";

export default class ChromeExtensionReloader extends AbstractChromePluginReloader {
  constructor(options?: PluginOptions) {
    super();
    if (process.env.NODE_ENV === "development") {
      const { reloadPage, port, entries } = merge(defaultOptions, options);

      const sourceFactory = (...sources): Source =>
        new ConcatSource(...sources);
      const source = middlewareSourceBuilder({ port, reloadPage });

      this._injector = middlewareInjector(entries, source, sourceFactory);
      this._triggerer = changesTriggerer(
        new HotReloaderServer(port),
        reloadPage
      );
    }
  }

  apply(compiler: any) {
    this._eventAPI = new CompilerEventsFacade(compiler);
    const { NODE_ENV } = process.env;
    console.log(NODE_ENV);
    if (process.env.NODE_ENV === "development") {
      this._eventAPI.afterOptimizeChunkAssets((comp, chunks) => {
        if (!compiler.options.entry.background) {
          throw new TypeError(bgScriptRequiredMsg.get());
        }

        comp.assets = {
          ...comp.assets,
          ...this._injector(comp.assets, chunks)
        };
      });

      this._eventAPI.afterEmit((comp, done) =>
        this._triggerer()
          .then(done)
          .catch(done)
      );
    } else {
      warn(onlyOnDevelopmentMsg.get());
    }
  }
}
