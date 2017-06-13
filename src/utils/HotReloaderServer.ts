import {OPEN, Server} from "ws";
import {signChange} from "./signals";
import FastReloadingThrottle from "../decorators/@FastReloadingThrottle";
import {MAX_CALLS, TIME_FRAME} from "../constants/fast-reloading.constants";

export default class HotReloaderServer {
    _server: Server;

    constructor(port: number) {
        this._server = new Server({port});
    }

    listen() {
        this._server.on('connection', ws => {
            ws.on('message', data => console.info(`Message from the client: ${JSON.parse(data).payload}`));
        });
    }

    @FastReloadingThrottle(MAX_CALLS, TIME_FRAME)
    signChange(reloadPage, done: Function) {
        try {
            this._server.clients.forEach(client => {
                if (client.readyState === OPEN) {
                    client.send(JSON.stringify(signChange({reloadPage})));
                }
            });
            done();
        }
        catch (err) {
            done(err);
        }
    }
}
