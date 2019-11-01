export default {
    MARKET_CAP_ICON: 'https://s2.coinmarketcap.com/static/img/coins/64x64/',
    MARKET_CAP_TICKER: 'https://api.coinmarketcap.com/v2/ticker/',
    MARKET_CAP_DATACHART: 'https://graphs2.coinmarketcap.com/currencies',
    TIME: {
        DAY: 86400000,
        WEEK: 653600000,
        MONTH: 2678400000
    },
    EXPLORER_API: (network, type) => {
        switch (network) {
            case 'ethereum':
                if (type) {
                    return `https://blockscout.com/eth/rinkeby`
                } else {
                    return `https://blockscout.com/eth/mainnet`
                }
            case 'nexty':
                if (type) {
                    return 'http://explorer.testnet.nexty.io';
                } else {
                    return 'https://explorer.nexty.io';
                }
            default:
                if (type) {
                    return 'https://apilist.tronscan.org'
                } else {
                    return ''
                }
        }
    },
    EXPLORER_WEB: (network, type) => {
        switch (network) {
            case 'ethereum':
                if (type) {
                    return 'https://rinkeby.etherscan.io/tx/'
                } else {
                    return 'https://etherscan.io/tx/'
                }
            case 'nexty':
                if (type) {
                    return 'http://explorer.testnet.nexty.io/tx/'
                } else {
                    return 'https://explorer.nexty.io/tx/'
                }
            default:
                if (type) {
                    return 'https://tronscan.org/#/transaction/'
                } else {
                    return 'https://tronscan.org/#/transaction/'
                }
        }
    }
}