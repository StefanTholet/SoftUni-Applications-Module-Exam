import {getLocalStorageData, objectToArray, inputValidator} from "/utils.js";
import {endPoints, databaseUrl} from '/auth.js';

export async function addData() {                                            //CHANGE ENDPOINT + Params             

    const { destination, imageUrl, departureDate, duration, city} = this.params;  
    const allValuesAreValid = inputValidator(this.params)
    if (!allValuesAreValid) {
        return
    }
    const {username, uid} = getLocalStorageData();
    const url = host(endPoints.destinations);
    const body = Object.assign({ owner: username }, {
        destination, imageUrl, departureDate, duration, city,uid
        // addedBy: getLocalStorageData().username,
    })
    const response = await post(url, body);
    patchId(response);
    this.redirect('/');
    return response;
}

export async function patchId(id) {                                          //CHANGE ENDPOINT
    const url = databaseUrl + `/destinations/${id.name}.json`
    const body = { id: id.name }
    const response = await patch(url, body);
    return response;
}


export async function getAll() {                                              //CHANGE ENDPOINT   
    const data = await get(host(endPoints.destinations))
    return objectToArray(data);
}

export async function getById(id) {                                             //CHANGE ENDPOINT
    const record = await get(host(endPoints.destinations + '/' + id));
    record.id = id;
    return record;
}

export async function editData(context) {                                      //CHANGE ENDPOINT 
    const key = '-' + this.app.last_location[1].split('/-')[1]
    const url = databaseUrl + `/destinations/${key}.json`;
    const body = { ...this.params };
    const allValuesAreValid = inputValidator(this.params)
    if (!allValuesAreValid) {
        return
    }
    await patch(url, body);
    this.redirect('/home');
}

export async function deleteData() {                                          //CHANGE ENDPOINT
    const urlExtension = this.params.id;
    const url = databaseUrl + `/destinations/${urlExtension}.json`;
    const data = await del(url);
    this.redirect('/my-destinations')
    return data;
}

export async function requestsManager(url, method, body) {
    try {
        let options = { method };
        if (body) {
            Object.assign(options, {
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(body)
            });
        }
        let response = await fetch(url, options);
        let data = await response.json();
        return data;
    } catch (error) {
        console.log('Error is: ' + error);
    }

}

//CRUDS
export async function get(url) {
    return requestsManager(url, 'GET')
}


 export async function post(url, body) {
    return requestsManager(url, 'POST', body);
}


 export async function del(url) {
    return requestsManager(url, 'DELETE')
}


 export async function patch(url, body) {
    return requestsManager(url, 'PATCH', body)
}

export function host(url) {
    let result = databaseUrl + url + '.json';
    const auth = getLocalStorageData();
    if (auth !== null) {
        result += `?auth=${auth.token}`;
    }
    return result;
}
