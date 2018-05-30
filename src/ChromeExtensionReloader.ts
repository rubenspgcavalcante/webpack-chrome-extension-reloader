import { merge } from "lodash";
import { ConcatSource } from "webpack-sources";
import AbstractChromePluginReloader from "./webpack/AbstractPlugin";
import middlewareSourceBuilder from "./utils/middleware-source-builder";
import middlewareInjector from "./utils/middleware-injector";
import changesTriggerer from "./utils/changes-triggerer";
import HotReloaderServer from "./utils/HotReloaderServer";
import defaultOptions from "./utils/default-options";
import CompilerEventsFacade from "./utils/CompilerEventsFacade";

export default class ChromeExtensionReloader extends AbstractChromePluginReloader {
  private _injector: Function;
  private _triggerer: Function;
  private _eventAPI: CompilerEventsFacade;

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

  apply(compiler: any) {
    this._eventAPI = new CompilerEventsFacade(compiler);

    if (process.env.NODE_ENV !== "production") {
      this._eventAPI.afterOptmizeChunkAssets(
        (comp, chunks) =>
          (comp.assets = {
            ...comp.assets,
            ...this._injector(comp.assets, chunks)
          })
      );

      this._eventAPI.afterEmit((comp, done) =>
        this._triggerer()
          .then(done)
          .catch(done)
      );
    }
  }
}
