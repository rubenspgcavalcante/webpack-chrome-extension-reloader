import {OPEN, Server} from "ws";
import {signChange, signLog} from "./signals";

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

    signChange(reloadPage) {
        try {
            this._server.clients.forEach(client => {
                if (client.readyState === OPEN) {
                    client.send(JSON.stringify(signChange({reloadPage})))
                }
            });
        }
        catch (err) {
            console.error(err);
        }
    }
}
