const express = require('express');
const unknownEndpoint = require('./middlewares/errorHandler')
const ebayScraper = require('./ebay');
const aliExpressScraper = require('./aliexpress')

const app = express();
app.use(express.json());

app.get('/ebay', async (req, res) => {
console.log('Scraping Ebay...')
const { product, countries } = req.body;
try {
const results = await ebayScraper(product, countries)
console.log('success', results)
return res.send(results)
} catch(err) {
console.log('failure', err)
return res.send(err)
}
});

app.get('/aliexpress', async (req, res) => {
console.log('Scraping AliExpress...')
const { product, countries } = req.body;
try {
const results = await aliExpressScraper(product, countries)
console.log('success', results)
return res.send(results)
} catch(err) {
console.log('failure', err)
return res.send(err)
}
});

app.use(unknownEndpoint);

module.exports = app;