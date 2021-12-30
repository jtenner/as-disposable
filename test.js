const loader = require("assemblyscript/lib/loader");
const fs = require("fs");

const buffer = fs.readFileSync("./build/test.wasm");

const api = loader.instantiateSync(buffer, {});

let memoryPtr = api.exports.setup();
api.exports.run();
if (api.exports.assert()) {
    console.log("Test successful");
    process.exit(0);
}
console.error("Test failed.");
process.exit(1);
