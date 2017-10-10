import {ConcatSource} from "webpack-sources";

export default ({background, contentScript}: EntriesOption, source: string) =>
    (assets, chunks) => chunks.forEach(({name, files}) => {
        if (name === background || name === contentScript) {
            const [entryPoint] = files;

            if (/\.js$/.test(entryPoint)) {
                assets[entryPoint] = new ConcatSource(source, assets[entryPoint]);
            }
        }
    })
