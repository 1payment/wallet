import {
    CreateETH,
    get_address_from_pk_eth,
    Update_balance_ETH,
    CheckIsETH,
    send_ETH
} from './ETH/account.service';
import {
    CreateTRX,
    get_address_form_pk_trx,
    Update_balance_TRX,
    CheckIsTRON,
    send_TRON,
    ConvertFromAddressTron,
    ConvertToAddressTron
} from './TRX/account.service';
import CryptoJS from 'crypto-js';
import 'ethers/dist/shims.js';
import { ethers } from 'ethers';
import { setStorage } from '../helpers/storages'

ethers.errors.setLogLevel("error");


export interface Tx {
    nonce?: string | number,
    chainId?: string | number,
    from?: string,
    to?: string,
    data?: string,
    value?: string | number,
    gas?: string | number,
    gasPrice?: string | number

}

export const Create_account = (network) => {
    return new Promise((resolve, reject) => {
        if (network == 'tron') {
            CreateTRX().then(acc => {
                resolve(acc)
            }).catch(e => reject(e))
        } else {
            CreateETH(network).then(acc => {
                resolve(acc)
            }).catch(e => reject(e))
        }
    })
}

export const Import_account = (privateKey, network) => {
    return new Promise((resolve, reject) => {
        if (network == 'tron') {
            get_address_form_pk_trx(privateKey).then(address => {
                resolve(address)
            }).catch(e => reject(e))
        } else {
            get_address_from_pk_eth(privateKey)
                .then(address => {
                    resolve(address)
                })
                .catch(e => reject(e))
        }
    })
}
/**
 * 
 * @param {string} addressTK 
 * @param {string} addressWL 
 * @param {string} network 
 * @param {number} decimals 
 */
export const Update_balance = (addressTK, addressWL, network, decimals) => new Promise((resolve, reject) => {
    if (network == 'tron') {
        Update_balance_TRX(addressTK, addressWL, decimals).then(bal => {
            resolve(bal)
        }).catch(e => reject(e))
    } else {
        Update_balance_ETH(addressTK, addressWL, network, decimals).then(bal => {
            resolve(bal)
        }).catch(e => reject(e))
    }
})

export const CheckIsAddress = async (address, network) => {
    if (network == 'tron') {
        return CheckIsTRON(address)
    } else {
        return CheckIsETH(address)
    }
}

export const Send_Token = (from, to, value, addressTK, privateKey, network, decimals, gasPrice?, gas?) => new Promise((resolve, reject) => {

    console.log('private key', privateKey)
    let rawTx: Tx = {
        from: from,
        to: to,
        value: value,
        gasPrice: gasPrice,
        gas: gas
    }
    if (network == 'tron') {
        send_TRON(rawTx, privateKey, addressTK, decimals)
    } else {
        send_ETH(rawTx, privateKey, network, addressTK, decimals).then(hash => {
            resolve(hash)
        }).catch(e => reject(e))
    }
})

export const Check_fee_with_balance = (fee, address, addressTK, network, decimals) => new Promise((resolve, reject) => {
    Update_balance_ETH(addressTK, address, network, decimals).then(bal => {
        if (bal > fee) {
            resolve(true)
        } else {
            resolve(false)
        }
    }).catch(e => reject(e))

})

export const Encrypt_password = (password) => new Promise((resolve, reject) => {
    try {
        var password_encrypt = CryptoJS.MD5(password).toString(CryptoJS.enc.Hex)
        resolve(password_encrypt)
    } catch (error) {
        reject(error)
    }
})

export const Encrypt = (text) => {
    var text_en = CryptoJS.MD5(text).toString(CryptoJS.enc.Hex)
    return text_en
}

export const Create_account_from_Seed = (network, seed, pwd, index) => new Promise(async (resolve, reject) => {
    if (network == 'tron') {
        CreateTRX().then(acc => {
            resolve(acc)
        }).catch(e => reject(e))
    } else {
        var Path = `m/44'/60'/0'/${index}`;
        var Decrypt_seed = await DecryptWithPassword(seed, pwd);
        var hdNode = ethers.utils.HDNode.fromSeed(Decrypt_seed);
        let node = hdNode.derivePath(Path);
        console.log(seed, node)
        let object_resolve = {
            address: node.address,
            privateKey: await EncryptWithPassword(node.privateKey, pwd)
        }
        setStorage('index_seed', index.toString())
        resolve(object_resolve)

    }
})



/**
 * Create wallet from Mnemonic word list
 * @param {string} wordlist Mnemonic word list
 * @param {number} index index of wallet in Mnemonic
 * @param {string} network netword want create wallet
 * @param {string} password password encrypt to encrypt seed and private key
 */
export const Create_account_secure = (wordlist, index = 0, network, password) => new Promise(async (resolve, reject) => {
    try {
        var Path = `m/44'/60'/0'/0/${index}`;
        var seed = ethers.utils.HDNode.mnemonicToSeed(wordlist);
        let hdNode = ethers.utils.HDNode.fromMnemonic(wordlist);
        let node = hdNode.derivePath(Path);
        console.log(seed, node)
        if (network == 'tron') {
            let address = await ConvertToAddressTron(node.address);
            let object_resolve = {
                seed: await EncryptWithPassword(seed, password),
                node: {
                    address,
                    privateKey: await EncryptWithPassword(node.privateKey, password)
                }
            }
            setStorage('index_seed', index.toString())
            resolve(object_resolve)
        } else {
            let object_resolve = {
                seed: await EncryptWithPassword(seed, password),
                node: {
                    address: node.address,
                    privateKey: await EncryptWithPassword(node.privateKey, password)
                }
            }
            setStorage('index_seed', index.toString())
            resolve(object_resolve)
        }
    } catch (error) {
        console.log(error)
        reject(error)
    }
})
/**
 * Encrypt text with password
 * @param {string} text text need encrypt
 * @param {string} password password to decrypt
 */
export const EncryptWithPassword = async (text: string, password: string) => {
    let encrypting = await CryptoJS.AES.encrypt(text, password).toString();
    return encrypting;
}

/**
 * Decrypt text with password
 * @param {string} encryptText text need encrypt
 * @param {string} password password to decrypt
 */
export const DecryptWithPassword = async (encryptText: string, password: string) => {
    let decrypting = await CryptoJS.AES.decrypt(encryptText, password).toString(CryptoJS.enc.Utf8);
    return decrypting;
}