import { AsyncStorage } from 'react-native';

export const setStorage = (key, data) => new Promise((resolve, reject) => {
    try {
        AsyncStorage.setItem(key, data).then(ss => {
            resolve()
        }).catch(e => reject(e))
    } catch (error) {
        reject(error)
    }
})

export const getStorage = (key) => new Promise((resolve, reject) => {
    try {
        AsyncStorage.getItem(key).then(data => {
            resolve(data)
        }).catch(e => reject(e))
    } catch (error) {
        reject(error)
    }
})

export const removeStorageWithKey = (key) => new Promise((resolve, reject) => {
    try {
        AsyncStorage.removeItem(key).then(ss => {
            resolve()
        }).catch(e => reject(e))
    } catch (error) {
        reject(error)
    }
})
