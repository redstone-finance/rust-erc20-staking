const path = require('path');

module.exports.contractSrc = path.join(__dirname, './pkg/pst-contract_bg.wasm');

module.exports.wasmSrcCodeDir = path.join(__dirname, './src');

module.exports.wasmGlueCode = path.join(__dirname, './pkg/pst-contract.js');
