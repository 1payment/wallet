# Ez Pay - Mutil wallet & ERC20 Tokens
 [<img src="https://raw.githubusercontent.com/nextyio/RN_EzKeyStore/master/screenshot/view.png">]('https://github.com/ezpayio/ezpay-wallet-mobile')
 
 ## Features
 - [x] Create/import Ethereum, Nexty, TRON wallet & ERC20 Token
 - [x] Check balance, transactions
 - [x] send/Receive ETH, NTY, TRON & ERC20 Token
 - [x] ĐAPP web browser and list collectible items.
 

## Build Ez Pay

In package.json delete row
```
    "react-native-http": "tradle/react-native-http#834492d",
```
and delete file package-lock.json, shim.js and install node module
```
    npm install
```
After node module has been install success then hack:

 ```sh
  ./node_modules/.bin/rn-nodeify --hack --install
  ```
  ### CocoaPods
  > CocoaPods 1.3+ is required

Run from your terminal to install the library.
	
	cd ios
	pod install
	cd ../
  ## Deploy
  
  start server react:
  ```sh
  npm start
  # or
  react-native start
  ```
  run app in device or simulator
  ```sh
  * react-native run-ios # for ios
  * react-native run-android # for android
  ```
  ## Contributing
  * Facebook:
  * Google:
  * LinkedIn:
  * Telegram:
  ## License
  
