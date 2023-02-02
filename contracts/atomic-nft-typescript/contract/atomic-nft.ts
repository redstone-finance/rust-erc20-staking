import { allowance, approve } from "../lib/allowance";
import { balanceOf, totalSupply } from "../lib/balance";
import { AtomicNFTState } from "../lib/faces";
import { transfer, transferFrom } from "../lib/transfer";

type Action = {
    input: Record<string, any>
}

export function handle(state: AtomicNFTState, action: Action) {
    const { input } = action;

    switch (action.input.function) {
        case FUNCTIONS.TRANSFER:
            return transfer(state, input.to, input.amount);
        case FUNCTIONS.TRANSFER_FROM:
            return transferFrom(state, input.from, input.to, input.amount);
        case FUNCTIONS.APPROVE:
            return approve(state, input.spender, input.amount);
        case FUNCTIONS.ALLOWANCE:
            return allowance(state, input.owner, input.spender);
        case FUNCTIONS.BALANCE_OF:
            return balanceOf(state, input.target);
        case FUNCTIONS.TOTAL_SUPPLY:
            return totalSupply(state);
        default:
            throw ContractError(`Function ${action.input.function} is not supported by this`)
    }

}


export enum FUNCTIONS {
    TRANSFER = 'transfer',
    TRANSFER_FROM = 'transferFrom',
    ALLOWANCE = 'allowance',
    APPROVE = 'approve',
    BALANCE_OF = 'balanceOf',
    TOTAL_SUPPLY = 'totalSupply'
}
