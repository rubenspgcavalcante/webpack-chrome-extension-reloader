import HotReloaderServer from "./HotReloaderServer";
import { info } from "../utils/logger";

export default (port: number, reloadPage: boolean) => {
  const server = new HotReloaderServer(port);

  info("[ Starting the Chrome Hot Plugin Reload Server... ]");
  server.listen();

  return (): Promise<any> => {
    return server.signChange(reloadPage);
  };
};
