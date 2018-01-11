import HotReloaderServer from "./HotReloaderServer";
import { info } from "./logger";

export default (server: HotReloaderServer, reloadPage: boolean) => {
  info("[ Starting the Chrome Hot Plugin Reload Server... ]");
  server.listen();

  return (): Promise<any> => {
    return server.signChange(reloadPage);
  };
};
