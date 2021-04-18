import { homePage, registerPage, loginPage, detailsPage, editProductPage, addProductPage, myDestinations } from '/controllers.js';
import { registerUser, loginUser,  logoutUser} from '/auth.js';
import {addData, editData, deleteData} from '/cruds.js'

const app = Sammy('#container', function () {

    this.use('Handlebars', 'hbs');

    this.get('/', (context) => {
        homePage.call(context);
    });

    this.get('/home', (context) => {
        homePage.call(context);
    });

    this.get('/register', registerPage);

    this.post('/register', (context) => {
        registerUser.call(context)
    })

    this.get('/login', loginPage);

    this.post('/login', (context) => {
        loginUser.call(context);
    });

    this.get('/logout', logoutUser);

    this.get('/create', addProductPage);

    this.post('/create', (context) => {
        addData.call(context);
    });

    this.get('/details/:id', (context) => {
        detailsPage.call(context);
    });

    this.get('/edit/:id', (context) => {
        editProductPage.call(context);
    });

    this.post('edit', (context) => {
        editData.call(context);
    });

    this.get('/delete/:id', (context) => {
        deleteData.call(context);
    });

    this.get('/my-destinations', (context) => {
        myDestinations.call(context);
    })
});


app.run('/'); 