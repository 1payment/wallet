export default {
    Poppins: 'Poppins-Light',
    Provider: (network, type) => {
        if (network == 'ethereum') {
            if (type) {
                return 'https://rinkeby.infura.io/v3/b174a1cc2f7441eb94ed9ea18c384730'
            } else {
                return 'https://mainnet.infura.io/v3/b174a1cc2f7441eb94ed9ea18c384730'
            }
        } else {
            if (type) {
                return `http://rpc.testnet.nexty.io:8545`
            } else {
                return `http://13.228.68.50:8545`
            }
        }
    },
    Get_decimals: (decimals) => { return Math.pow(10, decimals) },
}