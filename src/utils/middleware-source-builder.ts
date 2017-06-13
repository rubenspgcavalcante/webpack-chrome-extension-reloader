import {template} from "lodash"
import * as signals from "../utils/signals";
import * as rawSource from "raw-loader!../middleware/wcer-middleware";

export default function middleWareSourceBuilder({port, reloadPage}: MiddlewareTemplateParams): string {
    const tmpl = template(rawSource);
    return tmpl({
        WSHost: `ws://localhost:${port}`,
        reloadPage: `${reloadPage}`,
        signals: JSON.stringify(signals)
    });
}