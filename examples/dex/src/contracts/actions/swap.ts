import { SmartWeaveError } from 'warp-contracts';
import { ContractResult, DexAction, DexState } from '../types/types';

declare const ContractError;

/**
 * It calculates the expected amount of other tokens received after the swap.
 * The input tokens are passed by inserting value to only of of amountIn0, amountIn1 parameters
 * The value is calculated to maintain the "k" invariant defined as reserve0 * reserve1
 */
export const getAmountOutForAmountIn = async (
    state: DexState,
    { input: { amountIn0, amountIn1 } }: DexAction
  ): Promise<ContractResult> => {
    
    return { result: calculateAmountOut(
        state.reserve0, state.reserve1,
        amountIn0, amountIn1
    )};
};

/**
 * Swap tokens specified in the amountIn parameter
 */
 export const swap = async (
    state: DexState,
    { caller, input: { amountIn0, amountIn1 } }: DexAction
  ): Promise<ContractResult> => {

    //Get amount in
    let transferInResult = await SmartWeave.contracts.write(
        amountIn0 > 0 ? state.token0 : state.token1, {
        function: 'transferFrom',
        from: caller,
        to: SmartWeave.contract.id,
        amount: amountIn0 > 0 ? amountIn0 : amountIn1
    });

    //TODO: Check result of transferInResult

    //Pay out amount out

    const amountOut =  calculateAmountOut(
        state.reserve0, state.reserve1,
        amountIn0, amountIn1
    );

    let transferOutResult = await SmartWeave.contracts.write(
        amountIn0 > 0 ? state.token1 : state.token0, {
        function: 'transfer',
        to: caller,
        amount: amountOut
    });

    //TODO: Check result of transferOutResult

    // Update reserves

    if (amountIn0 > 0) {
        state.reserve0 += 10;
        state.reserve1 -= amountOut;    
    } else {
        state.reserve1 += amountIn1;
        state.reserve0 -= amountOut;
    }

    return { state };

 };

 const calculateAmountOut = (reserve0: number, reserve1: number, amountIn0: number, amountIn1: number) => {
    if (amountIn0 == 0 && amountIn1 == 0) {
        throw new ContractError('Must specify at lease one amountIn');
      }
  
      if (amountIn0 > 0 && amountIn1 > 0) {
          throw new ContractError('Must specify only one amountIn');
      }
  
    return amountIn0 > 0 
        //TODO: Check if rounding and floats are deterministic
        ? Math.round(amountIn0 * reserve1 / (reserve0 + amountIn0))
        : Math.round(amountIn1 * reserve0 / (reserve1 + amountIn1));
    
 }

  