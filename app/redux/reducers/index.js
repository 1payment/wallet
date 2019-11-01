import { combineReducers } from 'redux';
import Init_Setting from '../../settings/initApp'

let initState = {
    ListToken: []
}
export const Get_All_Token = (state = initState, action) => {
    switch (action.type) {
        case 'REFRESH_TOKEN':
            return {
                ListToken: action.payload
            }
        default:
            return state;
    }
}

const Settings = (state = Init_Setting, action) => {
    switch (action.type) {
        case 'SETTING':
            console.log('reducer', action.payload)
            return action.payload

        default:
            return state
    }
}

export default combineReducers({
    Get_All_Token,
    Settings
})