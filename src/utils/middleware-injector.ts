import {ConcatSource} from "webpack-sources";

export default function middlewareInjector({background, contentScript}, compilation, source: string) {
    const {assets} = compilation;

    compilation.plugin('after-optimize-chunk-assets', chunks => chunks.forEach(({name, files}) => {
        if (name === background || name === contentScript) {
            const [entryPoint] = files;

            if (/\.js$/.test(entryPoint)) {
                assets[entryPoint] = new ConcatSource(source, assets[entryPoint]);
            }
        }
    }));
}
