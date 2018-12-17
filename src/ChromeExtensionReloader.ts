import { merge } from "lodash";
import AbstractChromePluginReloader from "./webpack/AbstractChromeExtensionReloader";
import { middlewareInjector } from "./middleware";
import { changesTriggerer } from "./hot-reload";
import defaultOptions from "./utils/default-options";
import CompilerEventsFacade from "./webpack/CompilerEventsFacade";
import { onlyOnDevelopmentMsg } from "./messages/warnings";
import { bgScriptRequiredMsg } from "./messages/errors";
import { warn } from "./utils/logger";
import { isDevelopment } from "./utils/env";

export default class ChromeExtensionReloader extends AbstractChromePluginReloader {
  constructor(options?: PluginOptions) {
    super();
    if (isDevelopment) {
      const { reloadPage, port, entries } = merge(defaultOptions, options);

      this._injector = middlewareInjector(entries, { port, reloadPage });
      this._triggerer = changesTriggerer(port, reloadPage);
    }
  }

  apply(compiler: any) {
    this._eventAPI = new CompilerEventsFacade(compiler);

    if (isDevelopment) {
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
