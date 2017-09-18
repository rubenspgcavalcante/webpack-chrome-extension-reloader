import {ConcatSource} from "webpack-sources";

export default function middlewareInjector(compilation, source: string, excludedChunks: Array<string>) {
    compilation.plugin('after-optimize-chunk-assets', chunks =>
        chunks
            // skip excluded chunks.
            .filter(chunk => !excludedChunks.includes(chunk.name))
            .forEach(chunk => {
                chunk.files.forEach(fileName => {
                    if (/\.js$/.test(fileName)) {
                        compilation.assets[fileName] = new ConcatSource(source, compilation.assets[fileName]);
                    }
                });
            }));
}
