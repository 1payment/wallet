import { RefreshListToken } from "../../../../../redux/rootActions/easyMode";
import { Get_All_Token_Of_Wallet, Add_Token } from "../../../../../db";
import { Import_account } from "../../../../../services/index.account";

export const Func_Add_Account = token => dispatch => {
  return Add_Token(token)
    .then(ss => {
      return Get_All_Token_Of_Wallet()
        .then(listToken => {
          return dispatch(RefreshListToken(listToken));
        })
        .catch(console.log);
    })
    .catch(console.log);
};
