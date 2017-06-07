import {ConcatSource} from "webpack-sources";

import AbstractChromePluginReloader from "./webpack/AbstractPlugin";
import HotReloaderServer from "./utils/HotReloaderServer";
import MiddlewareSourceBuilder from "./utils/MiddlewareSourceBuilder";

export default class ChromeExtensionReloader extends AbstractChromePluginReloader {
    private _opts: PluginOptions;
    private _source: string;

    constructor(options?: PluginOptions) {
        super();
        this._opts = {ssl: false, reloadPage: true, port: 9090, ...options};
        this._opts.entries = {contentScript: 'contentScript', background: 'background', ...this._opts.entries};

        const sourceBuilder = new MiddlewareSourceBuilder();
        this._source = sourceBuilder.generateSource({
            port: this._opts.port,
            reloadPage: this._opts.reloadPage
        });
    }

    appendMiddleware(file, filename, compilation) {
        const key = `${filename}.js`;
        compilation.assets[key] = new ConcatSource(this._source, compilation.assets[key]);
    }

    apply(compiler) {
        const {port, reloadPage} = this._opts;

        console.info("[ Starting the Chrome Hot Plugin Reload Server... ]");
        const server = new HotReloaderServer(port);

        server.listen();
        compiler.plugin("compilation", compilation => {
            compilation.plugin('after-optimize-chunk-assets', chunks => chunks.forEach(chunk => {
                chunk.files.forEach(file => this.appendMiddleware(file, chunk.name, compilation));
            }));
        });

        compiler.plugin("emit", (comp, call) => {
            server.signChange(reloadPage);
            call();
        });
    }
}
