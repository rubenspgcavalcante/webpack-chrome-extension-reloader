import { merge } from "lodash";
import { ConcatSource } from "webpack-sources";
import AbstractChromePluginReloader from "./webpack/AbstractPlugin";
import middlewareSourceBuilder from "./utils/middleware-source-builder";
import middlewareInjector from "./utils/middleware-injector";
import changesTriggerer from "./utils/changes-triggerer";
import HotReloaderServer from "./utils/HotReloaderServer";
import defaultOptions from "./utils/default-options";

export default class ChromeExtensionReloader extends AbstractChromePluginReloader {
  private _injector: Function;
  private _triggerer: Function;

  constructor(options?: PluginOptions) {
    super();
    if (process.env.NODE_ENV !== "production") {
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

  apply(compiler) {
    if (process.env.NODE_ENV !== "production") {
      compiler.plugin("compilation", comp =>
        comp.plugin(
          "after-optimize-chunk-assets",
          chunks =>
            (comp.assets = {
              ...comp.assets,
              ...this._injector(comp.assets, chunks)
            })
        )
      );

      compiler.plugin("after-emit", (comp, done) =>
        this._triggerer()
          .then(done)
          .catch(done)
      );
    }
  }
}
