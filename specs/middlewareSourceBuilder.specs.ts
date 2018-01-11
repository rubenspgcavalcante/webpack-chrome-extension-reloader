import {assert} from "chai";
import middlewareSourceBuilder from "../src/utils/middleware-source-builder";

describe("middlewareSourceBuilder", () => {
  it("Build the middleware from the post-compiled source code", () => {
    assert(typeof  middlewareSourceBuilder({port: 1234, reloadPage: true}) === 'string');
  });
});