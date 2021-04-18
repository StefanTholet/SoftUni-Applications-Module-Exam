import { requestsManager, post, } from '/cruds.js';
import { setLocalStorageData, clearLocalStorageData,} from '/utils.js';

export const apiKey = 'AIzaSyAKawsf1hlb3FTJV9ESvdxKG8lVUUdW-1U';
export const databaseUrl = 'https://softuniexam-1942a.firebaseio.com/';
export const endPoints = {
    authentication: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=' + apiKey,
    register: `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
    signIn: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + apiKey,
    destinations: 'destinations'
}

export async function registerUser(context) {
    const { email, password, repeatPassword } = this.params;
    if (!email || !password || !repeatPassword || password !== repeatPassword) {
        console.log('wrong credentials');
        return;
    }
    const url = endPoints.register;
    const body = { email, password, returnSecureToken: true }
    const data = await requestsManager(url, 'POST', body);
    if (!data.hasOwnProperty('error')) {
        setLocalStorageData(data);
        this.redirect('/home');
        return data;
    } else {
        alert(data.error.message);
    }
}

export async function loginUser() {
    const { email, password } = this.params;
    if (!email || !password) {
        console.log('wrong credentials');
        return;
    }
    const url = endPoints.signIn;
    const body = { email, password, returnSecureToken: true, };
    const result = await post(url, body);
    console.log(result);
    if (!result.hasOwnProperty('error')) {
        setLocalStorageData(result);
        this.redirect('/home');
    } else {
        alert(result.error.message);
    }
}


export function logoutUser(context) {
    clearLocalStorageData()
        (context.redirect('/login'))
}