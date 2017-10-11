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
        contentScript: {name: "contentChunkName", path: "./path/to/content-script.js"}
    };

    const options: EntriesOption = {
        background: entriesInfo.background.name,
        contentScript: entriesInfo.contentScript.name
    };

    const fakeCssPath = "./path/to/some.css";
    const fakeImgPath = "./path/to/a/random-image.png";

    const assets = {
        [entriesInfo.background.path]: {source: () => "const bg = true;"},
        [entriesInfo.contentScript.path]: {source: () => "const cs = true;"},
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

    it("Should return only changed assets", () => {
        const newAssets = assetsBuilder(assets, chunks, sourceFactory);

        assert.notOk(newAssets.hasOwnProperty(fakeCssPath));
        assert.notOk(newAssets.hasOwnProperty(fakeImgPath));
    });
});