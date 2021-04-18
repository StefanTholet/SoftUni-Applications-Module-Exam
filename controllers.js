import { extendContext, getLocalStorageData, checkOwner, findAllUserDestinations } from "/utils.js";
import { getById, getAll } from "/cruds.js";

export async function homePage(context) {
    this.username = getLocalStorageData() ? getLocalStorageData().username : undefined;
    const products = await getAll();
    if (products.length > 0) {
        checkOwner.call(this, products, this.username);
        this.products = products;
    }
    await extendContext(this)
    this.partial('/templates/home.hbs');
}

export async function addProductPage(context) {
    this.username = getLocalStorageData() ? getLocalStorageData().username : undefined;
    extendContext(context)
        .then(this.partial('/templates/create.hbs'));
}

export async function detailsPage(context) {
    this.username = getLocalStorageData().username;
    this.product = await getById(this.params.id);
    if (this.product) {
        if (this.product.owner == this.username) {
            this.isOwner = true;
        } else {
            this.boughtIt = this.product.customers ? this.product.customers.find(x => x == this.username) : false;
        }
        await extendContext(this)
        this.partial('/templates/details.hbs');
    }
}

export async function editProductPage(context) {
    this.username = getLocalStorageData() ? getLocalStorageData().username : undefined;
    try {
        this.product = await getById(this.params.id)
        console.log(this);
        extendContext(this)
            .then(this.partial('/templates/edit.hbs'));
    } catch { (e) => console.log(e) }
}

export function loginPage(context) {
    extendContext(context)
        .then(this.partial('/templates/login.hbs'));
}

export function registerPage(context) {
    extendContext(context)
        .then(this.partial('/templates/register.hbs'));
}


export async function myDestinations() {
    this.username = getLocalStorageData() ? getLocalStorageData().username : undefined;
    const destinations = await getAll();
    const ownDestinations = findAllUserDestinations(destinations, this.username);
    this.destinations = ownDestinations;
    extendContext(this)
        .then(this.partial('/templates/my-destinations.hbs'));
}