export async function extendContext(context) {
    const partials = await Promise.all([              //CHANGE TEMPLATE NAMES
        context.load('/templates/partials/header.hbs'),
        context.load('/templates/partials/footer.hbs')
    ]);
    context.partials = {
        header: partials[0],
        footer: partials[1]
    }

}

export function objectToArray(data) {
    if (data === null || data === undefined) {
        return [];
    } else {
        return Object.entries(data).map(([k, v]) => Object.assign({ _id: k }, v));
    }
}

//Local Storage
export function setLocalStorageData(data) {
    const { email, idToken, localId } = data;
    localStorage.setItem('user', JSON.stringify(
        {
            username: email,
            uid: localId,
            token: idToken
        }
    ))
}

export function getLocalStorageData() {
    const auth = JSON.parse(localStorage.getItem('user'));
    if (auth !== null) {
        return auth;
    } else {
        return null;
    }
}


export function clearLocalStorageData() {
    localStorage.removeItem('user');
    return true;
}


export function checkOwner(data, username) {
    data.forEach(product => {
        if (product.owner == username) {
            product.isOwner = true;
        }
    });
}

export function findAllUserDestinations(data, userId) {
    const result = data.filter(x => Object.values(x).includes(userId));
    return result;
}

export function inputValidator(values) {
    const { destination, imageUrl, departureDate, duration, city } = values;
    if (!destination || !imageUrl || !departureDate || !duration || !city) {
        return false;
    }
    if (typeof destination !== 'string' || typeof imageUrl !== 'string' || typeof departureDate !== 'string' || !isNaN(duration) && duration < 1 || duration > 100 || typeof city !== 'string') {
        return false;
    }
    return true;
}


