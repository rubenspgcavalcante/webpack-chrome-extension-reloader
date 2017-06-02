import {install} from "source-map-support";
install();

import {ConcatSource} from "webpack-sources";
import * as template from "lodash.template";

import AbstractChromePluginReloader from "./webpack/AbstractPlugin"
import HotReloaderServer from "./utils/HotReloaderServer";
import * as rawSource from "./wcpr-middleware.js.txt";

export = class WebpackChromeReloaderPlugin extends AbstractChromePluginReloader {
    _opts: PluginOptions;
    _source: string;

    constructor(options?: PluginOptions) {
        super();
        this._opts = {ssl: false, reloadPage: true, port: 9090, ...options};
        this._opts.entries = {contentScript: 'contentScript', background: 'background', ...this._opts.entries};

        const tmpl = template(rawSource);
        this._source = template(tmpl({WSHost: `ws://localhost:${this._opts.port}`}));

    }

    appendMiddleware(file, filename, compilation) {
        const key = `${filename}.js`;
        compilation.assets[key] = new ConcatSource(this._source, compilation.assets[key]);
    }

    apply(compiler) {
        const {port, reloadPage} = this._opts;

        console.info("Starting the Chrome Hot Plugin Reload Server...");
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
