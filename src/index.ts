import { install } from "source-map-support";
import ChromeExtensionReloader from "./ChromeExtensionReloader";
import { DEBUG, ERROR, NONE } from "./constants/log.constants";
import { setLogLevel } from "./utils/logger";

install();

const logLevel =
  {
    production: ERROR,
    development: DEBUG,
    test: NONE
  }[process.env.NODE_ENV] || NONE;

setLogLevel(logLevel);
export = ChromeExtensionReloader;
