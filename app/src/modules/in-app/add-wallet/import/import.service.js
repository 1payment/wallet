import { RefreshListToken } from "../../../../../redux/rootActions/easyMode";
import { Get_All_Token_Of_Wallet, get_All_Account } from "../../../../../db";
import { Import_account } from "../../../../../services/index.account";
import 'ethers/dist/shims.js';
import { ethers } from "ethers";

export const Func_import_account = (value, type, network) => new Promise((resolve, reject) => {
  switch (type) {
    case "privatekey":
      Import_account(value, network)
        .then(address => {
          resolve(address);
        })
        .catch(e => reject("Invalid private key"));
      return;
    case "mnemoric":
      try {
        var Path = "m/44'/60'/0'/0/0";
        let hdNode = ethers.utils.HDNode.fromMnemonic(value);
        let node = hdNode.derivePath(Path);
        // wallet is objec: address,privateKey
        let wallet = new ethers.Wallet(node.privateKey);
        console.log(node, wallet);
        resolve(wallet);
      } catch (error) {
        reject(error);
      }
      return;
    default:
      return;
  }
});

export const getAllAccount = () => new Promise((resolve, reject) => {
  get_All_Account().then(ss => {
    resolve(ss)
  }).catch(e => reject(e))
})


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