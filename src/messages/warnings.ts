import Message from "./Message";
import { WARN } from "../constants/log.constants";

export const onlyOnDevelopmentMsg = new Message(
  WARN,
  1,
  "Warning, Chrome Extension Reloader Plugin was not enabled! It runs only on webpack --mode=development"
);

export const browserVerWrongFormat = new Message(
  WARN,
  2,
  "Warning, Chrome browser with unexpected version format. Expected x.x.x.x, Provided <%= version %>"
)