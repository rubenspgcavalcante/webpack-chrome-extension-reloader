import {assert} from "chai";
import {stub} from "sinon";

import middlewareInjector from "../src/utils/middleware-injector";

describe("middleware-injector", () => {
  let assetsBuilder, chunks;
  const sourceCode = "console.log('I am a middleware!!!')";
  const sourceFactory = stub().callsFake(
    (toConcat: string, file) => ({source: () => toConcat + file.source()})
  );

  const entriesInfo = {
    background: {name: "bgChunkName", path: "./path/to/bg-script.js"},
    contentScript: {name: "contentChunkName", path: "./path/to/content-script.js"},
    contentScript2: {name: "contentChunkName2", path: "./path/to/content-script2.js"}
  };

  const options: EntriesOption = {
    background: entriesInfo.background.name,
    contentScript: entriesInfo.contentScript.name
  };

  const optionsMultipleCS: EntriesOption = {
    background: entriesInfo.background.name,
    contentScript: [entriesInfo.contentScript.name, entriesInfo.contentScript2.name]
  };

  const fakeCssPath = "./path/to/some.css";
  const fakeImgPath = "./path/to/a/random-image.png";

  const assets = {
    [entriesInfo.background.path]: {source: () => "const bg = true;"},
    [entriesInfo.contentScript.path]: {source: () => "const cs = true;"},
    [entriesInfo.contentScript2.path]: {source: () => "const cs = true;"},
    [fakeCssPath]: {source: () => "some-css-source"},
    [fakeImgPath]: {source: () => "some-base64-source"}
  };

  beforeEach(() => {
    assetsBuilder = middlewareInjector(options, sourceCode, sourceFactory);

    chunks = [
      {name: options.background, files: [entriesInfo.background.path]},
      {name: options.contentScript, files: [entriesInfo.contentScript.path, fakeCssPath]},
      {name: "someOtherAsset", files: [fakeImgPath]}
    ];
  });

  it("Should find the background and content script entries and inject the middleware source on them", () => {
    const newAssets = assetsBuilder(assets, chunks, sourceFactory);

    const newBgSource = newAssets[entriesInfo.background.path].source();
    const oldBgSource = assets[entriesInfo.background.path].source();
    assert.equal(newBgSource, (sourceCode + oldBgSource));

    const newContentSource = newAssets[entriesInfo.contentScript.path].source();
    const oldContentSource = assets[entriesInfo.contentScript.path].source();
    assert.equal(newContentSource, (sourceCode + oldContentSource));
  });

  it("Should find the content script entries and inject the middleware source on them in case CS as array", () => {
    const assetsBuilderMultipleCS = middlewareInjector(optionsMultipleCS, sourceCode, sourceFactory);
    const chunksMultipleCS = [
      {name: optionsMultipleCS.background, files: [entriesInfo.background.path]},
      {name: optionsMultipleCS.contentScript[1], files: [entriesInfo.contentScript2.path, fakeCssPath]},
      {name: "someOtherAsset", files: [fakeImgPath]}
    ];
    const newAssets = assetsBuilderMultipleCS(assets, chunksMultipleCS);

    const newContentSource = newAssets[entriesInfo.contentScript2.path].source();
    const oldContentSource = assets[entriesInfo.contentScript2.path].source();
    assert.equal(newContentSource, (sourceCode + oldContentSource));
  });

  it("Should return only changed assets", () => {
    const newAssets = assetsBuilder(assets, chunks, sourceFactory);

    assert.notOk(newAssets.hasOwnProperty(fakeCssPath));
    assert.notOk(newAssets.hasOwnProperty(fakeImgPath));
  });
});