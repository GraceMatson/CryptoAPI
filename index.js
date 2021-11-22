const PORT = process.env.PORT || 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

const crypto = [];

const url = 'https://goldprice.org/cryptocurrency-price';
axios.get(url, {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36'
    }
})
    .then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);

        // console.log(html)
        let counter = -1;
        $('tr', html).each(function () {

            const rank = $(this).find('.views-field-field-market-rank').text().replace(/\s/g,'');
            const name = $(this).find('a').text();
            const id = name.toLowerCase().replace(/\s/g,'')
            const market_cap = $(this).find('.views-field-field-market-cap').text().replace(/\s/g,'');
            const price = $(this).find('.views-field-field-crypto-price').text().replace(/\s/g,'');
            const volume = $(this).find('.views-field-field-crypto-volume').text().replace(/\s/g,'');
            const change = $(this).find('.views-field-field-crypto-price-change-pc-24h').text().replace(/\s/g,'');
            counter += 1;
            if (counter>0) {
                crypto.push({
                    id,
                    rank,
                    name,
                    market_cap,
                    price,
                    volume,
                    change
                })
            }

        })
        console.log(crypto);
    })
    .catch(e => console.error(e));

app.get('/', (req, res) => {

    let html = `
        <h1>Hey there welcome to the Cryptocurrency API</h1>
        <p>To access info for all currencies go to /crypto/all</p>
        <p>To access info for specific currencies go to /crypto/:currency_id </p>
    `;
    res.send(html);
});

app.get('/crypto/all', (req, res) => {
    res.json(crypto);
});

app.get('/crypto/:cryptoId', (req, res) => {
    const cryptoId = req.params.cryptoId;

    const specCurrency = crypto.filter(currency => currency.id == cryptoId)[0];
    res.json(specCurrency);

});

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
