import {assert} from "chai";
import {spy, stub} from "sinon";

import changesTriggerer from "../src/utils/changes-triggerer";
import {SAME_COMPILATION_HASH_ERROR} from "../src/constants/errors.constants";

describe("changesTriggerer", () => {
    let hotReloadServerMock;
    beforeEach(() => {
        hotReloadServerMock = {
            listen: spy(),
            signChange: stub().callsFake(() => Promise.resolve())
        };
    });

    it("Should start the hot reloading server", () => {
        changesTriggerer(hotReloadServerMock, true);
        assert.isOk(hotReloadServerMock.listen.calledOnce);
    });

    it("Should only trigger the hot reload server when the compilation hash changes", () => {
        const triggerer = changesTriggerer(hotReloadServerMock, true);
        assert.equal(hotReloadServerMock.signChange.callCount, 0);

        triggerer("SOME_HASH")
            .then(() => assert.equal(hotReloadServerMock.signChange.callCount, 1));

        triggerer("SOME_HASH")
            .catch((err) => {
                assert.equal(err, SAME_COMPILATION_HASH_ERROR);
                assert.equal(hotReloadServerMock.signChange.callCount, 1)
            });
    });
});