export default function middlewareInjector(
  { background, contentScript }: EntriesOption,
  source: string,
  sourceFactory: SourceFactory
) {
  return (assets: object, chunks: WebpackChunk[]) =>
    chunks.reduce((prev, { name, files }) => {
      if (name === background || name === contentScript || contentScript.includes(name)) {
        const [entryPoint] = files;
        if (/\.js$/.test(entryPoint)) {
          prev[entryPoint] = sourceFactory(source, assets[entryPoint]);
        }
      }
      return prev;
    }, {});
}
