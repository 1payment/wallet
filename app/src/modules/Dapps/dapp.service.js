import { ethers } from 'ethers';
import { HexToString, signTransactionDapp } from '../../../services/ETH/account.service'


interface Tx {
    nonce?: string | number,
    chainId?: string | number,
    from?: string,
    to?: string,
    data?: string,
    value?: string | number,
    gas?: string | number,
    gasPrice?: string | number

}

/**
 * Sign message tx return signerTx Dapps
 * @param {Tx} tx tx want sign
 * @param {string} passcode wallet local passcode
 * @param {string} pk_en private encrypt
 */
export const signMessageDapps = async (message, passcode: string, privateKey: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('ggg', message, privateKey, passcode)

            let wallet = new ethers.Wallet(privateKey);
            let signature = await wallet.signMessage(message)
            resolve(signature)
        } catch (error) {
            console.log('err', error)
            reject(error)
        }
    })
}

/**
 * Sign transaction Dapp
 * @param {string} passcode password
 * @param {string} pk_en private key
 * @param {Tx} object tx transaction
 */
export const signTransaction = async (passcode, gasPrice, pk_en, object) => {
    return new Promise(async (resolve, reject) => {
        console.log(pk_en)
        var tx: Tx = {
            from: object.from,
            to: object.to,
            gasPrice: gasPrice,
            data: object.data,
            value: object.value,
        }
        signTransactionDapp(tx, pk_en, 18)
            .then(tx => {
                resolve(tx)
            }).catch(e => reject(e))
    })
}

export const convertHexToString = async (object) => {
    const value = HexToString(object.value) / 1e18
    const gas = HexToString(object.gas);
    const gasPrice = HexToString(object.gasPrice) / 1e9
    return {
        value,
        gas,
        gasPrice
    }
}