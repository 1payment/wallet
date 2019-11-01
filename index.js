/** @format */

import { AppRegistry } from 'react-native';
import Setup from './App';
import { name as appName } from './app.json';
import './global';
import './shim.js';
import crypto from 'crypto';
import SplashScreen from 'react-native-splash-screen';

/* disable yellowBox */
console.disableYellowBox = true;
SplashScreen.hide();
AppRegistry.registerComponent(appName, () => Setup);
