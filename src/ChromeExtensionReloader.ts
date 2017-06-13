import AbstractChromePluginReloader from "./webpack/AbstractPlugin";
import HotReloaderServer from "./utils/HotReloaderServer";
import middlewareSourceBuilder from "./utils/middleware-source-builder";
import middlewareInjector from "./utils/middleware-injector";

export default class ChromeExtensionReloader extends AbstractChromePluginReloader {
    private _opts: PluginOptions;
    private _source: string;

    constructor(options?: PluginOptions) {
        super();
        this._opts = {reloadPage: true, port: 9090, ...options};
        this._opts.entries = {contentScript: 'contentScript', background: 'background', ...this._opts.entries};

        this._source = middlewareSourceBuilder({
            port: this._opts.port,
            reloadPage: this._opts.reloadPage
        });
    }

    apply(compiler) {
        const {port, reloadPage} = this._opts;
        compiler.plugin("compilation", compilation => middlewareInjector(compilation, this._source));

        console.info("[ Starting the Chrome Hot Plugin Reload Server... ]");
        const server = new HotReloaderServer(port);
        server.listen();

        compiler.plugin("emit", (comp, call) => {
            server.signChange(reloadPage, call);
        });
    }
}
