import * as template from "lodash.template"
import * as signals from "../utils/signals";
import * as rawSource from "raw-loader!../middleware/wcpr-middleware";

export default class MiddlewareSourceBuilder {
    private _tmpl: Function;

    constructor() {
        this._tmpl = template(rawSource);
    }

    generateSource({port, reloadPage}: MiddlewareTemplateParams): string {
        return this._tmpl({
            WSHost: `ws://localhost:${port}`,
            reloadPage: `${reloadPage}`,
            signals: JSON.stringify(signals)
        });
    }
}
