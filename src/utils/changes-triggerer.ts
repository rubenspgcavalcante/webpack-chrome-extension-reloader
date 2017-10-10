import HotReloaderServer from "./HotReloaderServer";
import {green} from "colors/safe";

export default (reloadPage: boolean, serverPort: number) => {
    let lastHash;
    const server = new HotReloaderServer(serverPort);
    console.info(green("[ Starting the Chrome Hot Plugin Reload Server... ]"));
    server.listen();

    return ({hash}, done) => {
        if (lastHash !== hash) {
            lastHash = hash;
            server.signChange(reloadPage).then(done).catch(done)
        }
        else {
            done();
        }
    }
}