const viewList = document.getElementById('viewList');
const articles = Array.from(document.querySelectorAll('.art'));
const cards = Array.from(document.querySelectorAll('.grid .card'));
const pager = Array.from(document.querySelectorAll('.pg a'));

function showList(page) {
    articles.forEach(a => a.hidden = true);
    viewList.hidden = false;
    cards.forEach(c => c.hidden = +c.dataset.page !== page);
    pager.forEach(a => {
        const on = +a.dataset.page === page;
        a.classList.toggle('on', on);
        if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    document.title = 'Tin tức – ShipFast';
}

function showArticle(article) {
    viewList.hidden = true;
    articles.forEach(a => a.hidden = a !== article);
    document.title = article.dataset.title + ' – ShipFast';
}

function route() {
    const hash = location.hash.slice(1);
    const article = articles.find(a => a.dataset.slug === hash);
    if (article) showArticle(article); else showList(hash === 'trang-2' ? 2 : 1);
    window.scrollTo(0, 0);
}

addEventListener('hashchange', route);
route();
