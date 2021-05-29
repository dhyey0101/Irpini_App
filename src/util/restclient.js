import { BASE_URL } from './API';
import * as Localization from 'expo-localization';

export class RestClient {

    constructor(baseUrl) {
        this._baseUrl = baseUrl;
        this._finalLocal = '';

        _headers = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        });

        this.getLocal();
    }

    async getLocal() {
        const locale = await Localization.locale;
        this._finalLocal = locale.substr(0, 2);

    }

    
    /** POST with body */
    postWithBody(url, data) {
        return this.callRequest('POST', url, data);
    }

    /* POST without body */
    postWithoutBody(url) {
        return this.callRequest('POST', url);
    }

    /** POST with body and check api token */
    postWithBodyToken(url, data, Token) {
        return this.callRequestWithToken('POST', url, data, Token);
    }

    /** POST with form data */
    postWithFormData(url, data) {
        return this.callRequestWithFormToken("POST", url, data);
    }

    /** callRequest for non authenticated method */
    callRequest(method, url, data = null) {
        let API_URL = `${this._baseUrl}=${url}`
        return fetch(API_URL, {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "X-localization" : this._finalLocal,
            },
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status == 1) {
                    return responseJson;
                } else {
                    return responseJson;
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    /** callRequestWithToken for authentication token */
    callRequestWithToken(method, url, data, token) {
        let API_URL = `${this._baseUrl}/${url}`

        return fetch(API_URL, {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "X-localization" : this._finalLocal,
                'Authorization': token
            },
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.isError == false) {
                    return responseJson;
                } else {
                    return responseJson;
                }
            })
            .catch((error) => {
                return error;
            })
    }

    /** call request with formdata and api token */
    callRequestWithFormToken(method, url, data) {
        let API_URL = `${this._baseUrl}/${url}`;
        
        console.log(API_URL);
        return fetch(API_URL, {
            method: method,
            headers: {
                // Accept: 'application/json',
                'Content-Type': 'multipart/form-data'
            },
            body: data
            // body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.isError == false) {
                    return responseJson;
                } else {
                    return responseJson;
                }
            })
            .catch((error) => {
                console.log(error)
                return error;
            })



        // var xhr = new XMLHttpRequest();
        //     return new Promise((resolve, reject) => {
        //     xhr.withCredentials = true;
        //     xhr.onreadystatechange = e => {
        //     if (xhr.readyState !== 4) {
        //     return;
        //     }
        //     if (xhr.status === 200) {
        //         resolve(JSON.parse(xhr.responseText));
        //     } else {
        //         // alert("Request Failed");
        //         reject("Request Failed");
        //         console.log(xhr.status);
        //     }
        //     };
        //     xhr.open("POST", API_URL);
        //     xhr.setRequestHeader("cache-control", "no-cache");
        //     xhr.setRequestHeader("Content-Type", "multipart/form-data");
        //     xhr.setRequestHeader("Accept", "application/json");
        //     xhr.setRequestHeader("Authorization", token);
        //     xhr.setRequestHeader("X-localization", this._finalLocal);
        //     console.log(xhr);
        //     xhr.send(data);
        // });

    }

    /** send notification */
    sendNotification(data, title, msg) {
        return fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'accept-encoding': 'gzip, deflate',
                'host': 'exp.host'
            },
            body: JSON.stringify({
                to: data,
                title: title,
                body: msg,
            }),
        }).then((response) => response.json())
            .then((responseJson) => {
            })
            .catch((error) => { console.log(error) });
    }
}

export const defaultRestClient = new RestClient(BASE_URL);