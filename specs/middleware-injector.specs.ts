import {assert} from "chai";
import {stub} from "sinon";

import middlewareInjector from "../src/utils/middleware-injector";


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
  [entriesInfo.contentScript2.path]: {source: () => "const cs2 = true;"},
  [fakeCssPath]: {source: () => "some-css-source"},
  [fakeImgPath]: {source: () => "some-base64-source"}
};

const middlewareInjectorBeforeDescribe = () => {
  assetsBuilder = middlewareInjector(options, sourceCode, sourceFactory);

  chunks = [
    {name: options.background, files: [entriesInfo.background.path]},
    {name: options.contentScript, files: [entriesInfo.contentScript.path, fakeCssPath]},
    {name: "someOtherAsset", files: [fakeImgPath]}
  ];
};

describe("middleware-injector", () => {

  beforeEach(middlewareInjectorBeforeDescribe);

  it("Should return only changed assets", () => {
    const newAssets = assetsBuilder(assets, chunks, sourceFactory);

    assert.notOk(newAssets.hasOwnProperty(fakeCssPath));
    assert.notOk(newAssets.hasOwnProperty(fakeImgPath));
  });
});

describe("Should find the background and content script entries and inject the middleware source on them", () => {

  const sourceCheck = (assets, newAssets, path) => {
    const newSource = newAssets[entriesInfo.background.path].source();
    const oldSource = assets[entriesInfo.background.path].source();
    assert.equal(newSource, (sourceCode + oldSource));
  };

  beforeEach(middlewareInjectorBeforeDescribe);

  it("Content script as a string case", () => {
    const newAssets = assetsBuilder(assets, chunks, sourceFactory);

    sourceCheck(assets, newAssets, entriesInfo.background.path);
    sourceCheck(assets, newAssets, entriesInfo.contentScript.path);
  });

  it("Content script as an array case", () => {
    const assetsBuilderMultipleCS = middlewareInjector(optionsMultipleCS, sourceCode, sourceFactory);
    const chunksMultipleCS = [
      {name: optionsMultipleCS.background, files: [entriesInfo.background.path]},
      {name: optionsMultipleCS.contentScript[1], files: [entriesInfo.contentScript2.path, fakeCssPath]},
      {name: "someOtherAsset", files: [fakeImgPath]}
    ];
    const newAssets = assetsBuilderMultipleCS(assets, chunksMultipleCS);

    sourceCheck(assets, newAssets, entriesInfo.background.path);
    sourceCheck(assets, newAssets, entriesInfo.contentScript2.path);
  });

})