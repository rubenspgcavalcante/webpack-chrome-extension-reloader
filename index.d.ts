import { Plugin } from "webpack";

interface EntriesOption {
    /**
     * Entry for background script.
     */
    background: string;
    /**
     * Entry for content script.
     */
    contentScript: string;
}

interface PluginOptions {
    /**
     * Server listening port.
     * (default: `9090`)
     */
    port: number,
    /**
     * Force the reload of the page.
     * (default: `true`)
     */
    reloadPage: boolean,
    /**
     * Entries used for content and background scripts.
     * (default: `{ contentScript: `content-script`, background: 'background' }`)
     */
    entries: Partial<EntriesOption>
}

interface AbstractChromePluginReloader extends Plugin {
    context: any;

    apply(options?: any);
}

interface ChromeExtensionReloader extends AbstractChromePluginReloader {
    new (options?: Partial<PluginOptions>): ChromeExtensionReloader;
}

declare const chromeExtensionReloader: ChromeExtensionReloader;
export = chromeExtensionReloader;
