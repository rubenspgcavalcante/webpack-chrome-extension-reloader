import {assert} from "chai";
import {useFakeTimers} from "sinon";
import FastReloadingThrottle from "../src/decorators/@FastReloadingThrottle";
import {MAX_CALLS, TIME_FRAME} from "../src/constants/fast-reloading.constants";

const _ = require("lodash");

describe("FastReloadingThrottle decorator", () => {
    let calls;
    const clock = useFakeTimers();
    const MAX_CALLS_PER_MILLI = TIME_FRAME / MAX_CALLS;

    class Sample {
        @FastReloadingThrottle(MAX_CALLS, TIME_FRAME, global)
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

    it(`It should not let the method be called more than once per ${MAX_CALLS_PER_MILLI / 1000} secs.`, () => {
        const sample = new Sample();
        const interval = setInterval(() => sample.test(), 500);
        const frame = 4001;

        clock.tick(frame);
        clearInterval(interval);
        assert.equal(calls, (frame / MAX_CALLS_PER_MILLI).toFixed(0));
    });
});