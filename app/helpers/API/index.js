import Axios from 'axios';

export const POSTAPI = (uri: string, body) => {
    return fetch(uri, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    })
}
export const GETAPI = uri => {
    return fetch(uri)
}

export const GETAXIOS = uri => {
    return new Promise((resolve, reject) => {
        try {
            Axios.get(uri).then(data => {
                resolve(data)
            }).catch(e => reject(e))
        } catch (error) {
            reject(error)
        }
    })
}
export const POSTAXIOS = (uri, body) => {
    return new Promise((resolve, reject) => {
        try {
            Axios.post(uri, JSON.stringify(body)).then(data => {
                resolve(data)
            }).catch(e => reject(e))
        } catch (error) {
            reject(error)
        }
    })
}