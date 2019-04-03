import * as webpack from "webpack";

declare module "webpack" {
  export const version: string | void;
}
