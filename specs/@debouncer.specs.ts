import {assert} from "chai";
import {useFakeTimers} from "sinon";
import FastReloadingThrottle from "../src/decorators/@debouncer";
import {MAX_CALLS, TIME_FRAME} from "../src/constants/fast-reloading.constants";

const _ = require("lodash");

describe("debouncer decorator", () => {
    let calls;
    const clock = useFakeTimers();

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

    it(`It should debounce the method call for ${TIME_FRAME/MAX_CALLS}`, () => {
        const sample = new Sample();

        sample.test();
        clock.tick(400);
        sample.test();
        clock.tick(TIME_FRAME/MAX_CALLS);
        assert.equal(calls, 1);
    });
});