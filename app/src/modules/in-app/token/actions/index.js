import {
    insert_account_token,
    length_account_tokem,
    Remove_account_token,
    insert_index_seed,
    getSeeds,
    Update_name
} from "../../../../../db";
import { Create_account, Update_balance, Create_account_from_Seed } from '../../../../../services/index.account';
import { Func_import_account } from '../../add-wallet/import/import.service';
import SETTINGS from '../../../../../settings/initApp'
import { getStorage } from '../../../../../helpers/storages'

/**
 * Create account in token
 * @param {number} id_token 
 * @param {string} network 
 */
export const Create_account_of_token = (id_token, network) => new Promise((resolve, reject) => {
    if (SETTINGS.mode_secure) {
        getStorage('index_seed').then(index => {
            getStorage('password').then(pwd => {
                getSeeds().then(seed => {
                    Create_account_from_Seed(network, seed, pwd, parseInt(index) + 1).then(async wallet => {
                        console.log('wallet', wallet)
                        var ID = Math.floor(Date.now() / 1000);
                        let ObjAccount = {
                            id: ID,
                            name: `Account ${await length_account_tokem(id_token)}`,
                            token_type: network,
                            address: network == 'tron' ? wallet.address.base58 : wallet.address,
                            private_key: wallet.privateKey,
                            balance: 0,
                            time: new Date()
                        }
                        insert_account_token(id_token, ObjAccount).then(ss => {
                            resolve(true)
                        }).catch(e => reject(e))
                    })
                }).catch(err => console.log(err))
            })
        })
    } else {
        Create_account(network).then(async account => {
            var ID = Math.floor(Date.now() / 1000);
            let ObjAccount = {
                id: ID,
                name: `Account ${await length_account_tokem(id_token)}`,
                token_type: network,
                address: network == 'tron' ? account.address.base58 : account.address,
                private_key: account.privateKey,
                balance: 0,
                time: new Date()
            }
            insert_account_token(id_token, ObjAccount).then(ss => {
                resolve(true)
            }).catch(e => reject(e))
        }).catch(err => reject(err))
    }

})

export const Import_account_of_token = (id_token, Account) => new Promise(async (resolve, reject) => {
    Account.name = `Account ${await length_account_tokem(id_token)}`;
    insert_account_token(id_token, Account).then(ss => {
        resolve(true)
    }).catch(e => reject(e))
})



export const Remove_account_of_token = (id_account) => new Promise((resolve, reject) => {
    Remove_account_token(id_account).then(ss => {
        if (ss) {
            resolve(true)
        }
    }).catch(e => {
        console.log(e);
        reject(false)
    })
})

export const Update_name_of_account = (id, newName) => new Promise((resolve, reject) => {
    Update_name(id, newName).then(ss => {
        resolve(true)
    }).catch(e => reject(false))
})


export const Update_balance_token = (addressTK, network, addressWL, decimals) => dispatch => {
    return Update_balance(addressTK, addressWL, network, decimals).then(balance => {
        console.log(balance);
        return dispatch({ type: 'BalanceTK', payload: balance })
    })
}
