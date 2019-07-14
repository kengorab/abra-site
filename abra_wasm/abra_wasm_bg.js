
const path = require('path').join(__dirname, 'abra_wasm_bg.wasm');
const bytes = require('fs').readFileSync(path);
let imports = {};
imports['./abra_wasm'] = require('./abra_wasm');

const wasmModule = new WebAssembly.Module(bytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
module.exports = wasmInstance.exports;
