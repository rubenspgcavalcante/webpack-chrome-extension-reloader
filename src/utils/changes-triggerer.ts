import HotReloaderServer from "./HotReloaderServer";
import {green} from "colors/safe";

export default (reloadPage: boolean, serverPort: number) => {
    let lastHash;
    const server = new HotReloaderServer(serverPort);
    console.info(green("[ Starting the Chrome Hot Plugin Reload Server... ]"));
    server.listen();

    return (hash) => {
        if (lastHash !== hash) {
            lastHash = hash;
            return server.signChange(reloadPage)
        }
        return Promise.reject("Same compilation hash");
    }
}