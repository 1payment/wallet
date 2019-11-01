import { InsertNewWallet, UpdateWallet, DeleteWallet, SelectAllWallet } from '../../realm/walletSchema'

/**
 * Insert data 
 * @name action.payload.wallet object wallet
 */
let initState = {
    data: []
}
export function ActionDB(state = initState, action) {
    switch (action.type) {
        case 'INSERT_WALLET':
            InsertNewWallet(action.payload.wallet)
            return state;
        case 'UPDATE_WALLET':
            // UpdateWallet(action.payload.wallet)
            return state
        case 'DELETE_WALLET':
            DeleteWallet(action.payload.wallet.id)
            return state
        case 'GET_ALL_WALLET':
            return {
                data: action.payload
            }
        default:
            return state;
    }
}

