import REALM from "realm";
import { EASY } from "./ezMode/schema";
import { SECURE } from "./secureMode/schema";
import Settings from '../settings/initApp'

const DB_EASY = {
  path: "EASY.realm",
  schema: [EASY.ACCOUNT, EASY.TOKEN, EASY.WALLET, EASY.FAVORITE],
  schemaVersion: 0
};

const DB_SECURE = {
  path: "SECURE.realm",
  schema: [SECURE.ACCOUNT, SECURE.TOKEN, SECURE.WALLET, SECURE.FAVORITE],
  schemaVersion: 0
}

export const OPEN_REALM = () => {
  return REALM.open(Settings.mode_secure ? DB_SECURE : DB_EASY)
}


export const Remove_DB = () => new Promise(async (resolve, reject) => {
  try {
    REALM.deleteFile(DB_EASY);
    resolve("delete success");
  } catch (error) {
    reject(error);
  }
});

/**
 * Create first wallet
 * @param {object} wallet object wallet
 */
export const InitData = wallet => new Promise(async (resolve, reject) => {
  try {
    let Name_schema = Settings.mode_secure ? SECURE.WALLET_NAME : EASY.WALLET_NAME
    OPEN_REALM().then(realm => {
      realm.write(() => {
        realm.create(Name_schema, wallet);
        resolve(wallet);
      });
    })
      .catch(e => {
        console.log("eee", e);
        reject(e);
      });
  } catch (error) {
    console.log("eee", error);
    reject(error);
  }
});

/**
 * Import token to wallet
 * @param {object} Token object token
 */
export const Add_Token = Token => new Promise(async (resolve, reject) => {
  try {
    let Name_schema = Settings.mode_secure ? SECURE.WALLET_NAME : EASY.WALLET_NAME
    let filter = Settings.mode_secure ? 'mode="Secure"' : 'mode="Easy"'
    OPEN_REALM().then(realm => {
      Check_Exist_Token(Token.address)
        .then(check => {
          if (check) {
            reject("Token has exist");
          } else {
            // realm.create(EASY.TOKEN_NAME, Token)
            let Wallet = realm.objects(Name_schema).filtered(filter);
            realm.write(() => {
              Wallet[0].token.push(Token);
            });
            resolve(Token);
          }
        })
        .catch(er => reject(er));
    })
      .catch(e => reject(e));
  } catch (error) {
    reject(error);
  }
});

/**
 * Check exist token
 * @param {string} token_address address token
 */
export const Check_Exist_Token = token_address => new Promise(async (resolve, reject) => {
  try {
    let Name_schema = Settings.mode_secure ? SECURE.TOKEN_NAME : EASY.TOKEN_NAME;
    OPEN_REALM().then(realm => {
      let Token = realm.objects(Name_schema);
      console.log(
        "token",
        Token.findIndex(x => x.address == token_address)
      );
      if (
        Token.findIndex(x => x.address == token_address) > -1 &&
        token_address != ""
      ) {
        resolve(true);
      } else {
        resolve(false);
      }
    })
      .catch(e => reject(e));
  } catch (error) {
    reject(error);
  }
});
/**
 * Check exist wallet
 */
export const Check_Exist_Wallet = () => new Promise(async (resolve, reject) => {
  try {
    console.log(OPEN_REALM())
    let Name_schema = Settings.mode_secure ? SECURE.WALLET_NAME : EASY.WALLET_NAME
    OPEN_REALM().then(realm => {
      let Wallet = realm.objects(Name_schema);
      if (Wallet.length > 0) {
        resolve(true);
      } else {
        resolve(false);
      }
    })
      .catch(e => reject(e));
  } catch (error) {
    reject(error);
  }
});


/**
 * Remove all wallet
 */
export const Remove_all_wallet = () => new Promise((resolve, reject) => {
  try {
    let Name_schema = Settings.mode_secure ? SECURE.WALLET_NAME : EASY.WALLET_NAME;
    REALM.open(DB_SECURE).then(realm => {
      realm.write(() => {
        let Wallet = realm.objects(SECURE.WALLET_NAME);
        realm.delete(Wallet);
        resolve('remove wallet success');
      })
    })
  } catch (error) {
    reject(error)
  }
})


/**
 * Add account
 * @param {object} Account object account
 */
export const InsertNewAccout = Account => new Promise(async (resolve, reject) => {
  try {
    let Name_schema = Settings.mode_secure ? SECURE.ACCOUNT_NAME : EASY.ACCOUNT_NAME
    OPEN_REALM().then(realm => {
      realm.write(() => {
        try {
          realm.create(Name_schema, Account);
          console.log(Account);
          resolve(Account);
        } catch (error) {
          console.log(error);
          reject(error);
        }
      });
    })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  } catch (error) {
    console.log(error);
    reject(error);
  }
});


export const GetAllAddressOfToken = (name) => new Promise(async (resolve, reject) => {
  try {
    let Name_schema = Settings.mode_secure ? SECURE.TOKEN_NAME : EASY.TOKEN_NAME
    OPEN_REALM().then(realm => {
      let Token = realm.objects(Name_schema).filtered('name="' + name + '"');
      console.log(Array.from(Token)[0])
      resolve(Array.from(Token)[0])
    })
  } catch (error) {
    reject(error)
  }
})

export const GetAllAddressOfTokenAddress = (addressTk) => new Promise((resolve, reject) => {
  try {
    let Name_schema = Settings.mode_secure ? SECURE.TOKEN_NAME : EASY.TOKEN_NAME
    OPEN_REALM().then(realm => {
      let Token = realm.objects(Name_schema).filtered('address="' + addressTk + '"');
      console.log(Array.from(Token)[0])
      resolve(Array.from(Token)[0])
    })
  } catch (error) {
    reject(error)
  }
})



/**
 * Get all token of wallet
 */
export const Get_All_Token_Of_Wallet = () => new Promise(async (resolve, reject) => {
  try {
    let Name_schema = Settings.mode_secure ? SECURE.WALLET_NAME : EASY.WALLET_NAME;
    let filter = Settings.mode_secure ? 'mode="Secure"' : 'mode="Easy"'
    OPEN_REALM().then(realm => {
      let LisTokenOfWallet = realm.objects(Name_schema).filtered(filter);
      resolve(Array.from(LisTokenOfWallet)[0]["token"]);
    })
      .catch(e => reject(e));
  } catch (error) {
    reject(error);
  }
});

export const Get_Account_Of_Token = id_token => new Promise(async (resolve, reject) => { });

/**
 * Remove token
 * @param {string} nameTK name of token
 * @param {string} symbolTk symbol of token
 */
export const Remove_Token = (nameTK, symbolTk) => new Promise(async (resolve, reject) => {
  try {
    let Name_schema = Settings.mode_secure ? SECURE.TOKEN_NAME : EASY.TOKEN_NAME;
    OPEN_REALM().then(realm => {
      realm.write(() => {
        let token = realm.objects(Name_schema).filtered('name="' + nameTK + '" && symbol="' + symbolTk + '"');
        console.log("token", Array.from(token));
        token[0].account.forEach((item, index) => {
          console.log(item);
          realm.delete(item);
        })
        realm.delete(token);
        resolve("remove token");
      });
    })
      .catch(e => reject(e));
  } catch (error) {
    reject(error);
  }
});

export const Update_infor_token = (id, price, percent_change) => new Promise(async (resolve, reject) => {
  try {
    let Name_schema = Settings.mode_secure ? SECURE.TOKEN_NAME : EASY.TOKEN_NAME;
    OPEN_REALM().then(realm => {
      realm.write(() => {
        let token_need_update = realm.objectForPrimaryKey(Name_schema, id);
        token_need_update.price = price;
        token_need_update.percent_change = percent_change;
        resolve();
      });
    })
      .catch(e => reject(e));
  } catch (error) {
    reject(error);
  }
});

/**
 * Check exist address account of token
 * @param {number} id_token id of token need check exist address
 * @param {string} address address of account need check exist
 */
export const Check_exist_address = (id_token, address) => new Promise(async (resolve, reject) => {
  try {
    let Name_schema = Settings.mode_secure ? SECURE.TOKEN_NAME : EASY.TOKEN_NAME;
    OPEN_REALM().then(realm => {
      var token = realm.objects(Name_schema).filtered('id="' + id_token + '"');
      var account = token[0].account;
      account.forEach(element => {
        if (element.address == address) {
          resolve(true)
        }
      });
      resolve(false)
    })
      .catch(e => reject(e));
  } catch (error) {
    reject(error);
  }
});

export const get_Token = id => new Promise(async (resolve, reject) => {
  try {
    let Name_schema = Settings.mode_secure ? SECURE.TOKEN_NAME : EASY.TOKEN_NAME;
    OPEN_REALM().then(realm => {
      var token = realm.objects(Name_schema).filtered('id="' + id + '"');
      resolve(Array.from(token)[0]);
    });
  } catch (error) {
    reject(error);
  }
});


/**
* Insert wallet to schema ACCOUNT_EZ
* @param {number} id_token id of token want insert wallet
* @param {object} account object wallet want insert:
*/
export const insert_account_token = (id_token, account) => new Promise(async (resolve, reject) => {
  try {
    let Name_schema = Settings.mode_secure ? SECURE.TOKEN_NAME : EASY.TOKEN_NAME;
    OPEN_REALM().then(realm => {
      Check_exist_address(id_token, account.address).then(status => {
        if (status) {
          reject('Address has exist')
        } else {
          let Token = realm.objects(Name_schema).filtered('id="' + id_token + '"');
          realm.write(() => {
            Token[0]['account'].push(account);
            resolve(account);
          });
        }
      }).catch(e => reject(e))
    }).catch(e => reject(e));
  } catch (error) {
    reject(error);
  }
});

/**
 * Remove account
 * @param {number} id_account id of account want remove
 */
export const Remove_account_token = (id_account) => new Promise(async (resolve, reject) => {
  try {
    let Name_schema = Settings.mode_secure ? SECURE.ACCOUNT_NAME : EASY.ACCOUNT_NAME;
    OPEN_REALM().then(realm => {
      realm.write(() => {
        let account = realm.objects(Name_schema).filtered('id="' + id_account + '"');
        realm.delete(account);
        resolve(true);
      })
    }).catch(e => reject(e))
  } catch (error) {
    reject(error)
  }
})


/**
 * Update name of account
 * @param {Number} id_account id of account
 */
export const Update_name = (id_account, name) => new Promise((resolve, reject) => {
  try {
    OPEN_REALM().then(realm => {
      let Name_schema = Settings.mode_secure ? SECURE.ACCOUNT_NAME : EASY.ACCOUNT_NAME;
      var account = realm.objectForPrimaryKey(Name_schema, id_account)
      //  .filtered('id="' + id_account + '"');
      console.log('account', Array.from(account))
      realm.write(() => {
        account.name = name;
        resolve()
      })
    }).catch(err => reject(err))
  } catch (error) {
    reject(error)
  }
})


export const length_account_tokem = async (id_token) => {
  return OPEN_REALM().then(realm => {
    let Name_schema = Settings.mode_secure ? SECURE.TOKEN_NAME : EASY.TOKEN_NAME;
    var token = realm.objects(Name_schema).filtered('id="' + id_token + '"');
    var account = token[0].account;
    return account.length + 1
  })
}

export const update_Balance_db = (id, balance) => new Promise(async (resolve, reject) => {
  try {
    let Name_schema = Settings.mode_secure ? SECURE.ACCOUNT_NAME : EASY.ACCOUNT_NAME;
    OPEN_REALM().then(realm => {
      let account = realm.objectForPrimaryKey(Name_schema, id);
      realm.write(() => {
        account.balance = balance;
        resolve()
      })
    })
  } catch (error) {
    reject(error)
  }
})

export const update_total_balance = (id, total_balance) => new Promise(async (resolve, reject) => {
  try {
    let Name_schema = Settings.mode_secure ? SECURE.TOKEN_NAME : EASY.TOKEN_NAME;
    OPEN_REALM().then(realm => {
      let account = realm.objectForPrimaryKey(Name_schema, id);
      realm.write(() => {
        account.total_balance = parseFloat(total_balance);
        resolve()
      })
    })
  } catch (error) {
    reject(error)
  }
})

export const get_balance_wallet = (id) => new Promise(async (resolve, reject) => {
  try {
    let Name_schema = Settings.mode_secure ? SECURE.ACCOUNT_NAME : EASY.ACCOUNT_NAME;
    OPEN_REALM().then(realm => {
      let account = realm.objects(Name_schema).filtered('id="' + id + '"');
      resolve(account[0].balance)
    })
  } catch (error) {

  }
})


export const getSeeds = () => new Promise((resolve, reject) => {
  try {
    let Name_schema = Settings.mode_secure ? SECURE.WALLET_NAME : EASY.WALLET_NAME;
    let filter = Settings.mode_secure ? 'mode="Secure"' : 'mode="Easy"';
    OPEN_REALM().then(realm => {
      let seed = realm.objects(Name_schema).filtered(filter);
      console.log('ss', Array.from(seed))
      resolve(Array.from(seed)[0]['seeds'])
    })
  } catch (error) {
    reject(error)
  }
})

export const get_All_Account = () => new Promise((resolve, reject) => {
  try {
    let Name_schema = Settings.mode_secure ? SECURE.ACCOUNT_NAME : EASY.ACCOUNT_NAME;
    OPEN_REALM().then(realm => {
      let ListAccount = realm.objects(Name_schema);
      console.log('sss', ListAccount);
      resolve(Array.from(ListAccount))
    })
  } catch (error) {
    reject(error)
  }
})


/**                                                                                      **\
 * *************************|------------------------------------|************************ *
 * *************************|   Start Action in Schema Favorite  |************************ *
 * *************************|------------------------------------|************************ *
\**                                                                                      **/

////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Insert favorite
 * @param {object} favorite_object object favorite: id,name,address
 */
export const insert_favorite = (favorite_object) => new Promise(async (resolve, reject) => {
  try {
    REALM.open(DB_EASY).then(realm => {
      check_exist_address_favorite(favorite_object.name, favorite_object.address)
        .then(exist => {
          if (exist) {
            reject('Address or name has exist')
          } else {
            realm.write(() => {
              realm.create(EASY.FAVORITE_NAME, favorite_object);
              resolve(favorite_object)
            })
          }
        }).catch(e => reject(e))
    }).catch(err => reject(err))
  } catch (error) {
    reject(error)
  }
})

/**
 * check exist adddress or name in favorite
 * @param {string} name name of favorite
 * @param {string} address address of favorite
 */
export const check_exist_address_favorite = (name, address) => new Promise(async (resolve, reject) => {
  try {
    REALM.open(DB_EASY).then(realm => {
      var exist = realm.objects(EASY.FAVORITE_NAME).filtered('name="' + name + '" OR address="' + address + '"');
      console.log(Array.from(exist));
      if (exist.length > 0) {
        resolve(true)
      } else {
        resolve(false)
      }
    })
  } catch (error) {
    reject(error)
  }
})

/**
 * Update favorite
 * @param {object} favorite_object object favorite: id,name,address
 */
export const update_object_favotire = (favorite_object) => new Promise(async (resolve, reject) => {
  try {
    REALM.open(DB_EASY).then(realm => {
      var favorite = realm.objectForPrimaryKey(EASY.FAVORITE_NAME, favorite_object.id);
      realm.write(() => {
        favorite.name = favorite_object.name;
        favorite.address = favorite_object.address;
        resolve()
      })
    }).catch(err => reject(err))
  } catch (error) {
    reject(error)
  }
})


export const delete_favorite = (id) => new Promise(async (resolve, reject) => {
  try {
    REALM.open(DB_EASY).then(realm => {
      var favorite = realm.objectForPrimaryKey(EASY.FAVORITE_NAME, id);
      realm.write(() => {
        realm.delete(favorite)
        resolve()
      })
    }).catch(e => reject(e))
  } catch (error) {
    reject(error)
  }
})

export const get_all_favorite = () => new Promise(async (resolve, reject) => {
  try {
    REALM.open(DB_EASY).then(realm => {
      var favorite = realm.objects(EASY.FAVORITE_NAME)
      resolve(Array.from(favorite))
    }).catch(e => reject(e))
  } catch (error) {
    reject(error)
  }
})

export const name_favorite = async () => {
  return REALM.open(DB_EASY).then(realm => {
    var favorite = realm.objects(EASY.FAVORITE_NAME).filtered('name CONTAINS "Favorite"')
    console.log(Array.from(favorite));
    return (Array.from(favorite).length)
  })
}



export default new REALM(DB_EASY);
