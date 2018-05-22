declare type ActionType = string;
declare type Action = { type: ActionType, payload?: any };
declare type ActionFactory = (payload?: any) => Action;

declare type PluginOptions = { port: number, reloadPage: boolean, entries: EntriesOption };
declare type EntriesOption = { background: string, contentScript: ContentScriptOption };
declare type ContentScriptOption = string|Array<string>;

declare type MiddlewareTemplateParams = { port: number, reloadPage: boolean };

declare type LOG_LEVEL = 0 | 1 | 2 | 3 | 4 | 5;

declare interface Source {
  source();

  size(): number;

  map(options: object): void;

  sourceAndMap(options: object): object;

  node();

  listNode();

  updateHash(hash: string): void;
}

declare type SourceFactory = (concatSource: string, rootSource: string) => Source;
declare type WebpackChunk = { files: Array<string>, name: string };

declare module '*.json' {
  const json: any;
  export = json;
}

declare module '*.txt' {
  const text: string;
  export = text;
}

declare module "*.source.ts" {
  const sourceCode: string;
  export = sourceCode;
}

declare module "raw-loader*" {
  const rawText: string;
  export = rawText;
}