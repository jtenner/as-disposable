import loader from "@assemblyscript/loader";
import rtrace from "@assemblyscript/rtrace";
import fs from "fs";

const buffer = fs.readFileSync("./build/test.wasm");


const memory = new WebAssembly.Memory({
    initial: 10,
});
let rt = new rtrace.Rtrace({
    getMemory() {
        return memory;
    }
});

const api = loader.instantiateSync(buffer, rt.install({ memory }));

let memoryPtr = api.exports.setup();
api.exports.run();
if (api.exports.assert()) {
    console.log("Test successful");
    process.exit(0);
}
console.error("Test failed.");
process.exit(1);
