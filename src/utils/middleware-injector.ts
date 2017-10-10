import {ConcatSource} from "webpack-sources";

export default ({background, contentScript}: EntriesOption, source: string) =>
    (assets, chunks) => chunks
        .reduce((prev, {name, files}) => {
            if (name === background || name === contentScript) {
                const [entryPoint] = files;
                if (/\.js$/.test(entryPoint)) {
                    prev[entryPoint] = new ConcatSource(source, assets[entryPoint]);
                }
            }
            return prev;
        }, {});
