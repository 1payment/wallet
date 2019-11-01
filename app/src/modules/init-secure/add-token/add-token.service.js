import 'ethers/dist/shims.js';
import { ethers } from 'ethers';
import Wordlist from 'ethers/wordlists'

export const Create_phrase = () => new Promise((resolve, reject) => {
    try {
        var Path = "m/44'/60'/0'/0/0";
        var wordlist = ethers.utils.HDNode.entropyToMnemonic(ethers.utils.randomBytes(16))
        // console.log(wordlist);
        // let wallet = ethers.Wallet.createRandom();
        // let randomMnemomic = wallet.mnemonic;
        // console.log(wallet, randomMnemomic)
        resolve(wordlist)
    } catch (error) {
        reject(error)
    }
})

export const random_phrase = (array_wordlist: Array) => new Promise((resolve, reject) => {
    try {
        let array_random = [];
        function random() {
            var index = Math.floor(Math.random() * array_wordlist.length);
            array_random.push(array_wordlist[index]);
            array_wordlist.splice(index, 1);
            if (array_wordlist.length > 0) {
                random()
            } else {
                resolve(array_random)
            }
        }
        random()

    } catch (error) {
        reject(error)
    }
})

export const generate_space = (value: string) => {
    var char = ''
    for (let i = 0; i < value.length + 4; i++) {
        char = [char.slice(0, i), ` `, char.slice(i)].join('')
        if (i == value.length + 3) {
            return char;
        }
    }
}

export const isValidMnemonic = (wordlist) => {
    try {
        console.log(wordlist)
        var check = ethers.utils.HDNode.isValidMnemonic(wordlist);
        console.log('check', check)
        return check;
    } catch (error) {
        return false
    }

}
