import HotReloaderServer from "./HotReloaderServer";
import {green} from "colors/safe";
import {SAME_COMPILATION_HASH_ERROR} from "../constants/errors.constants";

export default (server: HotReloaderServer, reloadPage: boolean) => {
    let lastHash;
    
    console.info(green("[ Starting the Chrome Hot Plugin Reload Server... ]"));
    server.listen();

    return (hash) => {
        if (lastHash !== hash) {
            lastHash = hash;
            return server.signChange(reloadPage)
        }
        return Promise.reject(SAME_COMPILATION_HASH_ERROR);
    }
}