import HotReloaderServer from "./HotReloaderServer";
import {SAME_COMPILATION_HASH_ERROR} from "../constants/errors.constants";
import {info} from "./logger";

export default (server: HotReloaderServer, reloadPage: boolean) => {
    let lastHash;

    info("[ Starting the Chrome Hot Plugin Reload Server... ]");
    server.listen();

    return (hash: string): Promise<any> => {
        if (lastHash !== hash) {
            lastHash = hash;
            return server.signChange(reloadPage)
        }
        return Promise.reject(SAME_COMPILATION_HASH_ERROR);
    }
}