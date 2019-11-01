import Web3 from 'web3';
import ABI from '../../../ABI';
import { forkJoin } from 'rxjs';
import moment from 'moment';
import { sign } from '@warren-bank/ethereumjs-tx-sign';
import bigInt from 'big-integer';
import CONSTANT from '../../helpers/constant';
import { Tx } from '../index.account';
import InputDataDecoder from 'ethereum-input-data-decoder';
import Settings from '../../settings/initApp'

const WEB3 = new Web3()
// const WEB3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/'))
/**
 * Create account of network eth
 */
export const CreateETH = (network) => {
    return new Promise((resolve, reject) => {
        try {
            WEB3.setProvider(new WEB3.providers.HttpProvider(getProvider(network)))
            let account = WEB3.eth.accounts.create();
            resolve(account)
        } catch (error) {
            reject(error)
        }
    })
}

export const convertWeiToEther = (Wei) => {
    try {
        var ether = WEB3.utils.fromWei(Wei, 'ether');
    } catch (error) {
        console.log(error)
    }
    return ether
}

/**
 * Get infor of token
 * @param {string} Token_Address address of token
 */
export const Get_Infor_Token = (Token_Address, network) => new Promise(async (resolve, reject) => {
    try {
        WEB3.setProvider(new WEB3.providers.HttpProvider(getProvider(network)))
        let Contract = await new WEB3.eth.Contract(ABI, Token_Address);
        await forkJoin([
            Contract.methods.symbol().call(console.log),
            Contract.methods.decimals().call(console.log)
        ]).subscribe(sub => {
            let token_object = {
                id: Math.floor(Date.now() / 1000),
                name: sub[0],
                network: network,
                address: Token_Address,
                price: 0,
                percent_change: 0,
                icon: '',
                decimals: parseFloat(sub[1])
            }
            resolve(token_object);
        })

    } catch (error) {
        reject(error)
    }
})

/**
 * Return provider of web3
 * @param {string} network network
 */
const getProvider = (network: String) => {
    return CONSTANT.Provider(network, Settings.testnet)
    // switch (network) {
    //     case 'nexty':
    //         return CONSTANT.ProviderNTY('testnet')
    //     default:
    //         return CONSTANT.ProviderETH('rinkeby')
    // }
}

export const get_address_from_pk_eth = (privatekey: string) => {
    return new Promise((resolve, reject) => {
        try {
            if (privatekey.indexOf('0x') > -1) {
                resolve(WEB3.eth.accounts.privateKeyToAccount(privatekey).address)
            } else {
                console.log(WEB3.eth.accounts.privateKeyToAccount('0x' + privatekey))
                resolve(WEB3.eth.accounts.privateKeyToAccount('0x' + privatekey).address)
            }
        } catch (error) {
            console.log('error', error)
            reject(error)
        }
    })
}
/**
 * Function update balance token
 * @param {string} addressTk address of token
 * @param {string} addressWL address of wallet on token
 * @param {string} network network of token
 * @param {string} decimals decimals of token
 */
export const Update_balance_ETH = (addressTk, addressWL, network, decimals) => new Promise(async (resolve, reject) => {
    try {
        WEB3.setProvider(new WEB3.providers.HttpProvider(getProvider(network)))
        if (addressTk == '') {
            WEB3.eth.getBalance(addressWL).then(bal => {
                if (bal > 0) {
                    if (parseFloat(bal / CONSTANT.Get_decimals(decimals)) % 1 == 0) {
                        resolve(parseFloat(bal / CONSTANT.Get_decimals(decimals)))
                    } else {
                        resolve(parseFloat(bal / CONSTANT.Get_decimals(decimals)).toFixed(2))
                    }
                } else {
                    resolve(0)
                }
            }).catch(e => reject(e))
        } else {
            var contract = await new WEB3.eth.Contract(ABI, addressTk);
            await contract.methods.balanceOf(addressWL).call().then(bal => {
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

export const CheckIsETH = (address) => {
    return (WEB3.utils.isAddress(address))
}

/**
 * Send token on network Ethereum and Nexty
 * @param {Tx} tx rawTx 
 * @param {string} privatekey private key to sign transaction
 * @param {string} network network of token
 * @param {string} addressTk address of token
 * @param {number} decimals decimals of token
 */
export const send_ETH = (tx: Tx, privatekey: string, network: string, addressTk?: string, decimals: number) => new Promise(async (resolve, reject) => {
    try {
        WEB3.setProvider(new WEB3.providers.HttpProvider(getProvider(network)))
        tx.value = await tx.value * CONSTANT.Get_decimals(decimals);
        tx.value = await '0x' + bigInt(tx.value).toString(16);

        tx.gasPrice = await WEB3.utils.toWei(tx.gasPrice.toString(), 'Gwei');

        tx.nonce = await WEB3.eth.getTransactionCount(tx.from);

        console.log('tx', tx)
        if (addressTk == '') {
            console.log('value', tx)
            if (tx.gas <= 0) {
                tx.gas = await WEB3.eth.estimateGas(tx);
            }
            try {
                const rawTx = '0x' + await sign(tx, privatekey).rawTx;
                console.log('rawTx', rawTx)
                WEB3.eth.sendSignedTransaction(rawTx, (error, hash) => {
                    if (error) {
                        console.log('sss', error)
                        reject(error.toString())
                    } else {
                        console.log('hash', hash)
                        resolve(hash)
                    }
                })
            } catch (error) {
                console.log(error)
            }

        } else {
            var contract = new WEB3.eth.Contract(ABI, addressTk, { from: tx.from });
            var dataTx: Tx = {
                from: tx.from,
                to: addressTk,
                value: '0x0',
                data: contract.methods.transfer(tx.to, tx.value).encodeABI(),
                gasPrice: 0,
                nonce: tx.nonce,
                chainId: Settings.testnet ? 111111 : 666666,
                gas: tx.gas
            }
            if (tx.gas <= 0) {
                dataTx.gas = await WEB3.eth.estimateGas(tx);
            }
            console.log('dataTx', dataTx)
            const rawTx = '0x' + await sign(dataTx, privatekey).rawTx;
            WEB3.eth.sendSignedTransaction(rawTx, (error, hash) => {
                if (error) {
                    console.log('err 1', error)
                    reject(error)
                } else {
                    console.log(hash)
                    resolve(hash)
                }
            })
        }

    } catch (error) {
        console.log('err 2', error)
        reject(error)
    }
})

export const HexToString = (hex) => {
    const value = WEB3.utils.hexToNumberString(hex);
    if (value) {
        return value;
    } else {
        return 0
    }
}
/**
 * sign transaction in dapp
 * @param {object} tx object tx 
 * @param {string} privateKey private to sign transaction
 * @param {number} decimals decimal token
 */
export const signTransactionDapp = (tx: Tx, privateKey: string, decimals) => new Promise(async (resolve, reject) => {
    try {
        console.log('first tx', tx)
        WEB3.setProvider(new WEB3.providers.HttpProvider(getProvider('ethereum')))
        // if (tx.gasPrice == '') {
        // tx.gasPrice = await WEB3.eth.getGasPrice()
        // } else {
        tx.gasPrice = await WEB3.utils.toWei(tx.gasPrice.toString(), 'Gwei');
        console.log('gasprice', tx.gasPrice)
        // }
        tx.nonce = await WEB3.eth.getTransactionCount(tx.from);
        console.log('none', tx.nonce)
        tx.gas = await WEB3.eth.estimateGas(tx)
        console.log('tx', tx)
        const rawTx = '0x' + await sign(tx, privateKey).rawTx;
        resolve(rawTx)
    } catch (error) {
        console.log(error)
        reject(error)
    }
})
export const DecodeInput = (input) => new Promise(async (resolve, reject) => {
    try {
        const decoder = new InputDataDecoder(ABI);
        var result = decoder.decodeData(input)
        resolve(result)
    } catch (error) {
        reject(error)
    }
})