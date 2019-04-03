import { assert } from "chai";
import { spy, stub, SinonStub } from "sinon";
import ChromeExtensionReloaderImpl from "../src/ChromeExtensionReloader";
import * as webpack from "webpack";
import "../typings/webpack-augment";
import { ChromeExtensionReloaderInstance } from "webpack-chrome-extension-reloader";

describe("ChromeExtensionReloader", () => {
  const envCopy = { ...process.env };

  const registerStub = stub(
    ChromeExtensionReloaderImpl.prototype,
    "_registerPlugin"
  ).returns();
  const versionCheckSpy = spy(
    ChromeExtensionReloaderImpl.prototype._isWebpackGToEV4
  );

  function pluginFactory(
    version: string
  ): [ChromeExtensionReloaderInstance, SinonStub] {
    const webpackStub = stub(webpack, "version").value(version);
    const plugin = new ChromeExtensionReloaderImpl();
    return [plugin, webpackStub];
  }

  beforeEach(() => {
    registerStub.reset();
    versionCheckSpy.resetHistory();
    process.env = { ...envCopy };
  });

  describe("When applying plugin, should check if is in development mode", () => {
    it("Should check for --mode flag on versions >= 4", () => {
      const [plugin, stub] = pluginFactory("4.2.21");
      const mockedCompiler = <webpack.Compiler>{ options: {} };

      plugin.apply(mockedCompiler);
      assert(registerStub.notCalled);

      mockedCompiler.options.mode = "development";
      plugin.apply(mockedCompiler);
      assert(registerStub.calledOnce);

      stub.restore();
    });

    it("Should check for NODE_ENV variable on versions < 4", () => {
      delete process.env.NODE_ENV;
      const [plugin, stub] = pluginFactory("3.1.0");
      const mockedCompiler = <webpack.Compiler>{ options: {} };
      plugin.apply(mockedCompiler);

      assert(registerStub.notCalled);

      process.env.NODE_ENV = "development";

      plugin.apply(mockedCompiler);
      assert(registerStub.calledOnce);
      
      stub.restore();
    });
  });
});
