declare interface AbstractChromePluginReloader {
    context: any;
    apply(options?: any)
}

declare type ActionType = string;
declare type Action = { type: ActionType, payload?: any };
declare type ActionFactory = (payload?: any) => Action;

declare type PluginOptions = { ssl: boolean, port: number, reloadPage: boolean, entries: EntriesOption };
declare type EntriesOption = { background: string, contentScript: string };

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