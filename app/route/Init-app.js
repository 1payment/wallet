import { createStackNavigator } from 'react-navigation';
import Splash from '../src/modules/init-app/splash';
import FormPassword from '../src/components/form-input-password'

export default createStackNavigator(
    {
        Splash: { screen: Splash },
        Password: { screen: FormPassword }
    },
    {
        initialRouteName: 'Splash',
        headerMode: 'none',
        navigationOptions: {
            gesturesEnabled: false
        }
    }
)