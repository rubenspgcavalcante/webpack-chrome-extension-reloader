declare module "webpack-chrome-extension-reloader" {
  type PluginOptions = {
    port: number;
    reloadPage: boolean;
    entries: EntriesOption;
  };
  type EntriesOption = {
    background: string;
    contentScript: ContentScriptOption;
  };

  type ContentScriptOption = string | Array<string>;

  export default interface ChromeExtensionReloader {
    new (options?: PluginOptions): ChromeExtensionReloaderInstance;
  }

  export interface ChromeExtensionReloaderInstance {
    apply(compiler: Object): void;
  }
}
