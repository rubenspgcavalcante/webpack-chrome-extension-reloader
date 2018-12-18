import { Plugin } from "webpack";
import CompilerEventsFacade from "./CompilerEventsFacade";

export default abstract class AbstractChromeExtensionReloader
  implements Plugin {
  protected _injector: Function;
  protected _triggerer: Function;
  protected _eventAPI: CompilerEventsFacade;

  context: any;

  abstract apply(options?: any);
}
