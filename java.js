const main = document.querySelector('main');

HTMLElement.prototype.clear = function () {
    while(this.firstChild) {
        this.removeChild(this.firstChild);
    }
    return this;
};

const buildCharacterSheet = function (data) {
    const article = document.createElement('article');
    article.setAttribute('class', 'characterSheet');

    const heading = document.createElement('h1');
    const headingText = document.createTextNode(data.name);
    heading.appendChild(headingText);
    article.appendChild(heading);

    return article;
}

const buildspellSheet = function (data) {
    const article = document.createElement('article');
    article.setAttribute('class', 'spellSheet');

    const heading = document.createElement('h1');
    const headingText = document.createTextNode(data.name);
    heading.appendChild(headingText);
    article.appendChild(heading);

    return article;
}

var urlInfo = window.location.href;
var url = new URL(urlInfo);
var classes = url.searchParams.get("classes");
var spells = url.searchParams.get("spells");
console.log(classes);
if (classes == undefined) {
    classes = 6;
}
if (spells == undefined) {
    spells = 32;
}

const buildList = function (data) {
    const article = document.createElement('article');
    const ul = document.createElement('ul');

    if (data.previous) {
        const previous = document.createElement('a');
        const previousText = document.createTextNode('Previous');
        previous.appendChild(previousText);
        article.appendChild(previous);

        const urlString = data.previous.replace('http://dnd5eapi.co/api/', '');

        const type = urlString.split('/')[0];
        const page = urlString.split('/')[1].replace('?page=', '');

        previous.setAttribute('href', `?type=${type}&page=${page}`);
    }
    if (data.next) {
        const next = document.createElement('a');
        const nextText = document.createTextNode('Next');
        next.appendChild(nextText);
        article.appendChild(next);

        const urlString = data.next.replace('http://dnd5eapi.co/api/', '');

        const type = urlString.split('/')[0];
        const page = urlString.split('/')[1].replace('?page=', '');

        next.setAttribute('href', `?type=${type}&page=${page}`);
    }

    article.appendChild(ul);

    for (let i = 0; i < data.results.length; i++) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        const text = document.createTextNode(data.results[i].name);
        li.appendChild(a);
        a.appendChild(text);
        ul.appendChild(li);

        const urlString = data.results[i].url.replace('http://dnd5eapi.co/api/', '');

        const type = urlString.split('/')[0];
        const id = urlString.split('/')[1];

        a.setAttribute('href', `?type=${type}&id=${id}`);
    }

    return article;
}

main.clear();
const spinner = document.createElement('i');
spinner.setAttribute('class', 'fas fa-spinner fa-spin');
main.appendChild(spinner);

const getSingle = function (type, id) {
    fetch(`http://dnd5eapi.co/api/${type}/${id}`)
    .then(response => response.json())
    .then(data => {
        let sheet;
        switch (type) {
            case 'classes':
                sheet = buildCharacterSheet(data);
                break;
            case 'spells':
                sheet = buildspellSheet(data);
                break;
            default:
                sheet = buildCharacterSheet(data);
        }
        document
            .querySelector('main')
            .clear()
            .appendChild(sheet);
    });
};

const getList = function (type, page) {
    fetch(`http://dnd5eapi.co/api/${type}/?page=${page}`)
    .then(response => response.json())
    .then(data => {
        document
            .querySelector('main')
            .clear()
            .appendChild(buildList(data));
    });
};

document.addEventListener('DOMContentLoaded', () => {

    let type = url.searchParams.get('type') || 'classes';
    let page = url.searchParams.get('page') || 1;

    getList(type, page);

    const links = document.querySelectorAll('header nav ul li a');

    links.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const urlString = new URL(link.href);
            const page = urlString.searchParams.get('page');

            history.pushState({}, '', `?page=${page}`);

            const h1 = document.createElement('h1');
            const pageTitle = document.createTextNode(page);
            h1.appendChild(pageTitle);

            document.querySelectorAll('main').appendChild(h1);
        });
    });
});