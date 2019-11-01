const TronWeb = require('tronweb');
import { forkJoin } from 'rxjs';
import ABI from '../../../ABI';
import CONSTANT from '../../helpers/constant';
import { Tx } from '../index.account';
import Settings from '../../settings/initApp'

const TESTNET = {
    fullNode: 'https://api.shasta.trongrid.io/',
    solidityNode: 'https://api.shasta.trongrid.io/',
    eventServer: 'https://api.shasta.trongrid.io/',
}
const MAINNET = {
    fullHost: 'https://api.trongrid.io',
    eventServer: 'https://api.someotherevent.io',
}

const TRONWEB = new TronWeb(Settings.testnet ? TESTNET : MAINNET);

const setProvider = () => {
    TRONWEB = new TronWeb(Settings.testnet ? TESTNET : MAINNET);
}

export const CreateTRX = () => {
    return new Promise((resolve, reject) => {
        try {
            setProvider()
            let account = TRONWEB.createAccount();
            resolve(account);
        } catch (error) {
            reject(error)
        }
    })
}
/**
 * get address from private key
 * @param {string} privateKey private key of account
 */
export const get_address_form_pk_trx = (privateKey) => {
    return new Promise((resolve, reject) => {
        try {
            setProvider()
            var account = TRONWEB.address.fromPrivateKey(privateKey)
            resolve(account);
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * update balance token
 * @param {string} addressTK address token
 * @param {string} addressWL address account
 * @param {number} decimals decimals token
 */
export const Update_balance_TRX = (addressTK, addressWL, decimals) => new Promise(async (resolve, reject) => {
    try {
        setProvider()
        if (addressTK == '') {
            let bal = await TRONWEB.trx.getBalance(addressWL);
            console.log(bal)
            if (bal > 0) {
                if (parseFloat(bal / CONSTANT.Get_decimals(decimals)) % 1 == 0) {
                    resolve(parseFloat(bal / CONSTANT.Get_decimals(decimals)))
                } else {
                    resolve(parseFloat(bal / CONSTANT.Get_decimals(decimals)).toFixed(2))
                }
            } else {
                resolve(0)
            }
        } else {
            let res = await TRONWEB.trx.getContract(addressTK)
            var contract = await TRONWEB.contract().at(res['contract_address'])
            await contract.balanceOf(addressWL).call().then(bal => {
                if (bal > 0) {
                    if (parseFloat(bal / CONSTANT.Get_decimals(decimals)) % 1 == 0) {
                        resolve(parseFloat(bal / CONSTANT.Get_decimals(decimals)))
                    } else {
                        resolve(parseFloat(bal / CONSTANT.Get_decimals(decimals)).toFixed(2))
                    }
                } else {
                    resolve(0)
                }
            })
        }
    } catch (error) {
        reject(error)
    }
})

/**
 * check address is tron or not
 * @param {string} address address of account
 */
export const CheckIsTRON = (address: string) => {
    return TRONWEB.isAddress(address)
}
/**
 * Function send TRX and token of TRX
 * @param {Tx} tx transaction object: from, to, data, value,gas, gaPrice, chainID, nonce
 * @param {string} privatekey private to sign Transaction
 * @param {string} addressTK address token
 * @param {number} decimals decimals of token
 */
export const send_TRON = (tx: Tx, privatekey: string, addressTK: string, decimals: number) => new Promise(async (resolve, reject) => {
    try {
        setProvider()
        // hex amount token
        tx.value = await tx.value * CONSTANT.Get_decimals(decimals);
        tx.value = await '0x' + TRONWEB.toBigNumber(tx.value).toString(16);

        // hex address recive and address send
        tx.to = await TRONWEB.address.toHex(tx.to);
        tx.from = await TRONWEB.address.toHex(tx.from);

        // create transaction 
        let transaction = await TRONWEB.transactionBuilder.sendToken(tx.to, tx.value, tx.from);

        // sign transaction
        let signedTransaction = await TRONWEB.trx.sign(transaction, privatekey);

        await TRONWEB.trx.sendRawTransaction(signedTransaction).then(result => {
            resolve(result)
        }).catch(e => {
            reject(e)
        })
    } catch (error) {
        reject(error)
    }
})

/**
 * convert address wallet from type ETH, NTY to type of TRON
 * @param {string} address address want convert
 */
export const ConvertToAddressTron = (address: string) => {
    return TRONWEB.address.fromHex(address);
}

/**
 * Convert address wallet from type TRON to type of ETH, NTY
 * @param {string} address address want convert
 */
export const ConvertFromAddressTron = (address: string) => {
    return TRONWEB.address.toHex(address)
}
