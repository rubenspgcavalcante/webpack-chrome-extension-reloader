import { merge } from "lodash";
import AbstractChromePluginReloader from "./webpack/AbstractChromeExtensionReloader";
import { middlewareInjector } from "./middleware";
import { changesTriggerer } from "./hot-reload";
import defaultOptions from "./utils/default-options";
import CompilerEventsFacade from "./webpack/CompilerEventsFacade";
import { onlyOnDevelopmentMsg } from "./messages/warnings";
import { bgScriptRequiredMsg } from "./messages/errors";
import { warn } from "./utils/logger";

import { Compiler } from "webpack";
import {
  ChromeExtensionReloaderInstance,
  PluginOptions
} from "webpack-chrome-extension-reloader";

export default class ChromeExtensionReloaderImpl extends AbstractChromePluginReloader
  implements ChromeExtensionReloaderInstance {
  private _opts?: PluginOptions;
  constructor(options?: PluginOptions) {
    super();
    this._opts = options;
  }
  apply(compiler: Compiler) {
    const { reloadPage, port, entries } = merge(defaultOptions, this._opts);
    if (compiler.options.mode === "development") {
      this._eventAPI = new CompilerEventsFacade(compiler);
      this._injector = middlewareInjector(entries, { port, reloadPage });
      this._triggerer = changesTriggerer(port, reloadPage);
      this._eventAPI.afterOptimizeChunkAssets((comp, chunks) => {
        if (!compiler.options.entry || !compiler.options.entry["background"]) {
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
