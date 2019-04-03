import { merge } from "lodash";
import AbstractChromePluginReloader from "./webpack/AbstractChromeExtensionReloader";
import { middlewareInjector } from "./middleware";
import { changesTriggerer } from "./hot-reload";
import defaultOptions from "./utils/default-options";
import CompilerEventsFacade from "./webpack/CompilerEventsFacade";
import { onlyOnDevelopmentMsg } from "./messages/warnings";
import { bgScriptRequiredMsg } from "./messages/errors";
import { warn } from "./utils/logger";
import * as webpack from "webpack";
import "../typings/webpack-augment";

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

  _isWebpackGToEV4() {
    if (webpack.version) {
      const [major] = webpack.version.split(".");
      if (parseInt(major) >= 4) return true;
    }
    return false;
  }

  _registerPlugin(compiler: webpack.Compiler) {
    const { reloadPage, port, entries } = merge(defaultOptions, this._opts);

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
  }

  apply(compiler: webpack.Compiler) {
    if (
      (this._isWebpackGToEV4()
        ? compiler.options.mode
        : process.env.NODE_ENV) === "development"
    ) {
      this._registerPlugin(compiler);
    } else {
      warn(onlyOnDevelopmentMsg.get());
    }
  }
}
