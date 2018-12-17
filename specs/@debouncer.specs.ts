import {assert} from "chai";
import {useFakeTimers} from "sinon";
import debouncer from "../src/decorators/@debouncer";
import {FAST_RELOAD_DEBOUNCING_FRAME} from "../src/constants/fast-reloading.constants";

const _ = require("lodash");

describe("debouncer decorator", () => {
  let calls;
  const clock = useFakeTimers();

  class Sample {
    @debouncer(FAST_RELOAD_DEBOUNCING_FRAME, global)
    test() {
      calls++;
    }
  }

  beforeEach(() => {
    calls = 0;
  });

  afterEach(() => {
    clock.restore();
  });

  it(`It should debounce the method call for ${FAST_RELOAD_DEBOUNCING_FRAME} milli`, () => {
    const sample = new Sample();
    sample.test();
    clock.tick(400);
    sample.test();
    clock.tick(FAST_RELOAD_DEBOUNCING_FRAME);
    assert.equal(calls, 1);
  });
});