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

  interface ChromeExtensionReloaderConstructor {
    new (options?: PluginOptions): ChromeExtensionReloader;
  }

  export default interface ChromeExtensionReloader {
    apply(compiler: Object): void;
  }
}
