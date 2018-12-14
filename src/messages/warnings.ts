import Message from "./Message";
import { WARN } from "../constants/log.constants";

export const onlyOnDevelopmentMsg = new Message(
  WARN,
  1,
  "Chrome Extension Reloader Plugin runs only on NODE_ENV=development"
);
