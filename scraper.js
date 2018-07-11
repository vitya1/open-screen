var scrape = require('website-scraper');

let r = 'https://www.b2b-center.ru/help/%D0%A0%D0%B5%D0%B3%D0%BB%D0%B0%D0%BC%D0%B5%D0%BD%D1%82_%D0%BE_%D0%BF%D0%BE%D1%80%D1%8F%D0%B4%D0%BA%D0%B5_%D0%BF%D1%80%D0%B5%D0%B4%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F_%D0%B8_%D0%BF%D0%BE%D0%BB%D1%83%D1%87%D0%B5%D0%BD%D0%B8%D1%8F_%D1%81%D1%82%D1%80%D0%B0%D1%85%D0%BE%D0%B2%D1%8B%D1%85_%D1%83%D1%81%D0%BB%D1%83%D0%B3';

var options = {
    urls: [r],
    directory: './save/',
};

// with promise
scrape(options).then((result) => {
    console.log(result);
    /* some code here */
}).catch((err) => {
    console.log('err', err);
    /* some code here */
});
