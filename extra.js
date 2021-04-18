async function patchLikesAndComments() {
    const postId = this.params.id;                                         //CHANGE ENDPOINT
    const url = databaseUrl + `${endPoints.ideas}/${postId}.json`;
    const currentArticle = await getById(postId);
    const currentUser = getLocalStorageData().username;
    const path = this.path.split('/')[1];
    let body;
    switch (path) {
        case 'like':
            const likes = currentArticle.likes || [];
            if (likes.indexOf(currentUser) != -1) {
                return;
            }
            likes.push(currentUser);
            body = { likes };
            break;
        case 'comment':
            let comments = currentArticle.comments || [];
            const value =`${currentUser}: ${document.querySelector('.textarea-det').value}`; 
            comments.push(value);
            body = {comments};
            break;
    }
    const response = await patch(url, body);
    return response;
}


async function postLikes(context) {
    const username = getLocalStorageData().username;
    const urlExtension = this.params.id;
    const url = databaseUrl + `/ideas/${urlExtension}.json`;
    const data = await get(url);
    const dataArray = data.likes || [];
    dataArray.push(username);
    if (data.likes == undefined) {
        if (data)
            data.likes = dataArray;
    }
    const patchRequest = await patch(url, data);
    this.redirect('/movie-details/:id')
}


 function sortArticlesByCategories(articles) {
    const sortedArticles = {
        'javascript': [],
        'c#': [],
        'java': [],
        'python': []
    }
    articles.forEach(article => {
        const articleCategory = article.category ? article.category.toLowerCase() : undefined;
        if (sortedArticles.hasOwnProperty(articleCategory)) {
        sortedArticles[articleCategory].push(article);
    }
    })
    //console.log(sortedArticles);
    return sortedArticles;
}

//routers

async function homePage(context) {
    this.username = getLocalStorageData() ? getLocalStorageData().username : undefined;
    const articles = await getData();
    if (articles) {
        this.articles = [];
        Object.keys(articles).forEach(article => {
            if (articles[article].addedBy == this.username) {
                this.articles.push(articles[article]);
            }
        })
    }
    await extendContext(this)
    this.partial('/templates/home.hbs');
}




//delete all posts of a user

//controller 
export async function deleteProfile() {
    const data = await getAll();
    const id = document.querySelector('h1').textContent; //use element with id content
    const posts = findAllUserPosts(data, id);
    deleteAllUserPosts.call(this, posts);
}

//utils 

export function findAllUserPosts(data, userId) {
    const result = data.filter(x => Object.values(x).includes(userId));
    return result;
}

export function deleteAllUserPosts(data) {
    data.forEach(post => {
        this.params.id = post._id;
        deleteData.call(this);  // << change redirect from del crud function
    })
} 


//NOTIFICATIONS 
export async function displaySuccessNotification(message, targetLocation) {
    const divElement = document.createElement('div')
    divElement.id = 'infoBox';
    divElement.classList.add('notification');
    const spanElement = document.createElement('span');
    divElement.appendChild(spanElement);
    divElement.style.display = 'block';
    spanElement.textContent = message;
    const headerElement = document.querySelector('nav');
    headerElement.parentNode.insertBefore(divElement, headerElement.nextSibling);

    const delay = ms => new Promise(res => setTimeout(res, ms));

    await delay(3000)
    divElement.style.display = 'none';

    await delay(3000)
    this.redirect(targetLocation);
}




export function displayErrorNotification(message, targetLocation) {
    const divElement = document.createElement('div')
    divElement.id = 'errorBox';
    divElement.classList.add('notification');
    const spanElement = document.createElement('span');
    divElement.appendChild(spanElement);
    divElement.style.display = 'block';
    spanElement.textContent = message;
    const headerElement = document.querySelector('nav');
    headerElement.parentNode.insertBefore(divElement, headerElement.nextSibling);

    const delay = ms => new Promise(res => setTimeout(res, ms));

    await delay(3000)
    divElement.style.display = 'none';

    await delay(3000)
    this.redirect(targetLocation);
}

window.api = displaySuccessNotification;