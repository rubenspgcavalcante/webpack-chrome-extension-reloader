import {assert} from "chai";
import {spy, stub} from "sinon";

import changesTriggerer from "../src/utils/changes-triggerer";

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
});