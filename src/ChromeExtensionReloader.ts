import {ConcatSource} from "webpack-sources";
import AbstractChromePluginReloader from "./webpack/AbstractPlugin";
import middlewareSourceBuilder from "./utils/middleware-source-builder";
import middlewareInjector from "./utils/middleware-injector";
import changesTriggerer from "./utils/changes-triggerer";
import HotReloaderServer from "./utils/HotReloaderServer";

export default class ChromeExtensionReloader extends AbstractChromePluginReloader {
    private _injector: Function;
    private _triggerer: Function;

    constructor(options?: PluginOptions) {
        super();
        const defaultEntries = {contentScript: 'content-script', background: 'background'};
        const {reloadPage = true, port = 9090, entries = defaultEntries} = {...options};

        const sourceFactory = (...sources): Source => new ConcatSource(...sources);
        const source = middlewareSourceBuilder({
            port: port,
            reloadPage: reloadPage
        });

        this._injector = middlewareInjector(entries, source, sourceFactory);
        this._triggerer = changesTriggerer(new HotReloaderServer(port), reloadPage);
    }

    apply(compiler) {
        compiler.plugin("compilation", (comp) =>
            comp.plugin('after-optimize-chunk-assets',
                (chunks) => comp.assets = {...comp.assets, ...this._injector(comp.assets, chunks)}
            ));

        compiler.plugin("after-emit", (comp, done) =>
            this._triggerer(comp.hash).then(done).catch(done));
    }
}
