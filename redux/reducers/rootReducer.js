import { combineReducers } from 'redux';
import {
    Register,
    snapToWallet,
    eventSnap,
    updateBalance,
    getListToken,
    BalanceToken,
    Language
} from './walletReducer';
import { ActionDB } from './queryDB'
export default combineReducers({
    Register,
    snapToWallet,
    ActionDB,
    eventSnap,
    updateBalance,
    getListToken,
    BalanceToken,
    Language
})