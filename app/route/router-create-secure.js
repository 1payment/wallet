import { createStackNavigator } from 'react-navigation';
import TypeAdd from '../src/modules/init-secure/select-type-create';
import UpdatePassword from '../src/modules/init-secure/password';
import SelectToken from '../src/modules/init-secure/select-token';
import LoadingCreate from '../src/modules/init-secure/loading-create';
import Add_Token from '../src/modules/init-secure/add-token'
import QRscan from '../src/components/QR-scan'

export default createStackNavigator(
    {
        TypeAdd: { screen: TypeAdd },
        UpdatePassword: { screen: UpdatePassword },
        SelectToken: { screen: SelectToken },
        LoadingCreate: { screen: LoadingCreate },
        Add_Token: { screen: Add_Token },
        QRScan: { screen: QRscan },

    }, {
        initialRouteName: 'TypeAdd',
        headerMode: 'none'
    }
)