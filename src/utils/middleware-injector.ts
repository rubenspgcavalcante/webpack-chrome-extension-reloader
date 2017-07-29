import {ConcatSource} from "webpack-sources";

export  default function middlewareInjector(compilation, source: string) {
    compilation.plugin('after-optimize-chunk-assets', chunks => chunks.forEach(chunk => {
        chunk.files.forEach(fileName => {
            if(fileName === 'extract-text-webpack-plugin-output-filename') { return; }
            compilation.assets[fileName] = new ConcatSource(source, compilation.assets[fileName]);
        });
    }));
}
