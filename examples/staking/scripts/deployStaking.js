const fs = require('fs');
const path = require('path');
const { getWarp, setContractTxId, loadWallet, getContractTxId, requireModule } = require('warp-contract-utils');
const { ArweaveSigner } = require('warp-contracts-plugin-deploy');

//LoggerFactory.INST.logLevel('debug', 'WasmContractHandlerApi');

(async () => {
  const warp = getWarp();
  const [ownerWallet, ownerAddress] = await loadWallet(warp, false, __dirname);

  let erc20TxId = getContractTxId(warp.environment, __dirname, 'erc20');

  let initialStakingState = {
    canEvolve: true,
    evolve: '',
    settings: null,
    owner: ownerAddress,
    token: erc20TxId,
    stakes: {},
  };

  let deployment = await warp.deploy({
    wallet: new ArweaveSigner(ownerWallet),
    initState: JSON.stringify(initialStakingState),
    src: fs.readFileSync(path.join(__dirname, '../pkg/staking-contract_bg.wasm')),
    wasmSrcCodeDir: path.join(__dirname, '../pkg/src'),
    wasmGlueCode: path.join(__dirname, '../pkg/staking-contract.js'),
  });

  console.log('Deployed Staking contract: ', deployment.contractTxId);
  setContractTxId(warp.environment, deployment.contractTxId, __dirname, 'staking');
})();
