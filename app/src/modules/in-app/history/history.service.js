import URI from '../../../../helpers/constant/uri';
import { POSTAPI, GETAPI } from '../../../../helpers/API'
import * as moment from "moment";
import Settings from '../../../../settings/initApp';
import InputDataDecoder from 'ethereum-input-data-decoder';
import ABI from '../../../../../ABI';

export class HistoryModel {
    tx: String;
    blockNumber: Number;
    from: String;
    to: String;
    value: Number;
    time: Moment;
    isToken: Boolean
}

export let historyData: Array<HistoryModel> = [];

const DecodeInput = (input) => new Promise((resolve, reject) => {
    try {
        const decoder = new InputDataDecoder(ABI);
        var result = decoder.decodeData(input);
        resolve(result);
    } catch (error) {
        reject(error)
    }
})


export const getDataHistory = (start: number = 1, address, network, decimals, addressTK) => new Promise((resolve, reject) => {
    let body = {
        address,
        start
    }
    if (network == 'tron') {
        let uri = URI.EXPLORER_API(network, Settings.testnet) + '/api/transaction?sort=-timestamp&count=true&limit=20&start=0&address=' + address
        GETAPI(uri)
            .then(res => res.json())
            .then(response => {
                console.log('response', response)
                historyData = [];
                for (let entry of response.data) {
                    let historyEntry = new HistoryModel();
                    historyEntry.tx = entry['hash'];
                    historyEntry.blockNumber = entry['block'];
                    historyEntry.from = entry['ownerAddress'];
                    historyEntry.to = entry['toAddress'];
                    historyEntry.value = entry['contractData']['amount'];
                    historyEntry.time = moment.unix(entry['timestamp']);
                    historyEntry.isToken = false;
                    historyData.push(historyEntry)
                }
                resolve(historyData)
            })
    } else {
        if (addressTK == '') {
            // ISN'T TOKEN
            let uri = URI.EXPLORER_API(network, Settings.testnet) + '/api?module=account&action=txlist&address=' + address + '&page=' + start + '&offset=20&sort=desc';
            console.log(`uri isn't token`, uri)
            GETAPI(uri)
                .then(res => res.json())
                .then(response => {
                    console.log('response', response)
                    historyData = [];
                    for (let entry of response.result) {

                        let historyEntry = new HistoryModel();
                        historyEntry.tx = entry['hash'];
                        historyEntry.blockNumber = entry['blockNumber'];
                        historyEntry.from = entry['from'];
                        historyEntry.to = entry['to'];
                        historyEntry.value = parseFloat(entry['value'] / Math.pow(10, decimals));
                        historyEntry.time = moment.unix(entry['timeStamp']);
                        historyEntry.isToken = false
                        DecodeInput(entry['input']).then(decode => {
                            if (decode.method == 'transfer') {
                                historyEntry.isToken = true
                            } else {
                                historyData.push(historyEntry)
                            }
                        })
                    }
                    resolve(historyData)
                })
        } else {
            // IS TOKEN
            let uri = URI.EXPLORER_API(network, Settings.testnet) + '/api?module=account&action=tokentx&address=' + address + '&contractaddress=' + addressTK + '&page=' + start + '&offset=20&sort=desc'
            console.log(`uri is token`, uri)
            GETAPI(uri)
                .then(res => res.json())
                .then(response => {
                    historyData = [];
                    for (let entry of response.result) {
                        let historyEntry = new HistoryModel();
                        historyEntry.tx = entry['hash'];
                        historyEntry.blockNumber = entry['blockNumber'];
                        historyEntry.from = entry['from'];
                        historyEntry.to = entry['to'];
                        historyEntry.value = parseFloat(entry['value'] / Math.pow(10, decimals));
                        historyEntry.time = moment.unix(entry['timeStamp']);
                        historyEntry.isToken = false
                        DecodeInput(entry['input']).then(decode => {
                            if (decode.method == 'transfer') {
                                historyEntry.isToken = true
                                if (decode.names[0] == '_to') {
                                    historyEntry.to = '0x' + decode.inputs[0];
                                } else {
                                    historyEntry.from = '0x' + decode.inputs[0]
                                }
                                historyEntry.value = parseFloat(decode.inputs[1].toString()) / Math.pow(10, decimals);
                            }
                        })
                        historyData.push(historyEntry)
                    }
                    resolve(historyData)
                })
        }

    }

})


