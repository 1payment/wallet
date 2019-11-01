import REALM, { ObjectSchema } from 'realm';
const ACCOUNT_NAME = 'ACCOUNT_EZ';
const WALLET_NAME = 'TOKEN_EZ';
const TOKEN_NAME = 'WALLET_EZ';
const FAVORITE_NAME = 'FAVORITE_EZ';

const ACCOUNT: ObjectSchema = {
    name: ACCOUNT_NAME,
    primaryKey: 'id',
    properties: {
        id: 'int',
        name: 'string',
        token_type: 'string',
        address: 'string',
        private_key: 'string',
        balance: 'double?',
        time: 'date'
    }
}
const TOKEN: ObjectSchema = {
    name: TOKEN_NAME,
    primaryKey: 'id',
    properties: {
        id: 'int',
        name: 'string',
        symbol: 'string',
        network: 'string',
        address: 'string?',
        price: 'double?',
        percent_change: 'double?',
        account: { type: 'list', objectType: ACCOUNT_NAME },
        icon: 'string?',
        decimals: 'int?',
        total_balance: 'double?',
        id_market: 'int?'
    }
}

const WALLET: ObjectSchema = {
    name: WALLET_NAME,
    primaryKey: 'id',
    properties: {
        id: 'int',
        mode: 'string',
        seeds: 'string',
        token: { type: 'list', objectType: TOKEN_NAME, optional: false },
        // token: `${TOKEN_NAME}[]`
    }
}

const FAVORITE: ObjectSchema = {
    name: FAVORITE_NAME,
    primaryKey: 'id',
    properties: {
        id: 'int',
        name: 'string',
        address: 'string'
    }
}

export const EASY = {
    ACCOUNT,
    ACCOUNT_NAME,
    WALLET,
    WALLET_NAME,
    TOKEN,
    TOKEN_NAME,
    FAVORITE,
    FAVORITE_NAME,
}