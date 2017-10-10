import {OPEN, Server} from "ws";
import {signChange} from "./signals";
import debouncer from "../decorators/@debouncer";
import fastReloadBlock from "../decorators/@fastReloadBlock";
import {DEBOUNCING_FRAME, FAST_RELOAD_CALLS, FAST_RELOAD_WAIT} from "../constants/fast-reloading.constants";

export default class HotReloaderServer {
    _server: Server;

    constructor(port: number) {
        this._server = new Server({port});
    }

    listen() {
        this._server.on('connection', ws => {
            ws.on('message', (data: string) => console.info(`Message from the client: ${JSON.parse(data).payload}`));
        });
    }

    signChange(reloadPage: boolean): Promise<any> {
        return new Promise((res, rej) => {
            this._safeSignChange(reloadPage, res, rej);
        });
    }

    @debouncer(DEBOUNCING_FRAME)
    @fastReloadBlock(FAST_RELOAD_CALLS, FAST_RELOAD_WAIT)
    private _safeSignChange(reloadPage, onSuccess, onError) {
        try {
            this._sendMsg(signChange({reloadPage}));
            onSuccess();
        }
        catch (err) {
            onError(err);
        }
    }

    private _sendMsg(msg: any) {
        this._server.clients.forEach(client => {
            if (client.readyState === OPEN) {
                client.send(JSON.stringify(msg));
            }
        });
    }
}
