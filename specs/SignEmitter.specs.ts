import SignEmitter from "../src/hot-reload/SignEmitter";
import { assert } from "chai";
import { spy, SinonSpy } from "sinon";
import * as blockProtection from "../src/utils/block-protection";
import {
  FAST_RELOAD_DEBOUNCING_FRAME,
  FAST_RELOAD_CALLS,
  FAST_RELOAD_WAIT,
  NEW_FAST_RELOAD_CHROME_VERSION,
  NEW_FAST_RELOAD_DEBOUNCING_FRAME,
  NEW_FAST_RELOAD_CALLS
} from "../src/constants/fast-reloading.constants";

describe("SignEmitter", () => {
  let mockedServer: any;
  let debouncerSpy: SinonSpy;
  let fastReloadBlockerSpy: SinonSpy;

  beforeEach(() => {
    mockedServer = {
      clients: []
    };
    debouncerSpy = spy(blockProtection, "debounceSignal");
    fastReloadBlockerSpy = spy(blockProtection, "fastReloadBlocker");
  });
  afterEach(() => {
    debouncerSpy.restore();
    fastReloadBlockerSpy.restore();
  })

  it("Should setup signal debouncer as fast reload blocker to avoid extension blocking", () => {
    const emitter = new SignEmitter(mockedServer, "0.0.0.0");

    assert(debouncerSpy.calledWith(FAST_RELOAD_DEBOUNCING_FRAME));
    assert(
      fastReloadBlockerSpy.calledWith(FAST_RELOAD_CALLS, FAST_RELOAD_WAIT)
    );
  });

  it(`Should assign new rules if the Chrome/Chromium version is >= ${
    NEW_FAST_RELOAD_CHROME_VERSION
  }`, () => {
    const emitter = new SignEmitter(
      mockedServer,
      NEW_FAST_RELOAD_CHROME_VERSION
    );

    assert(debouncerSpy.calledWith(NEW_FAST_RELOAD_DEBOUNCING_FRAME));
    assert(
      fastReloadBlockerSpy.calledWith(NEW_FAST_RELOAD_CALLS, FAST_RELOAD_WAIT)
    );
  });
});
