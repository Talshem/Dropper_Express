const puppeteer = require("puppeteer");

async function ebayScrape(product, country) {
  // launches tor browser
  const browser = await puppeteer.launch({
    // executablePath: 'google-chrome-stable',
    args: [" --no-sandbox"],
    headless: false,
  });

  const page = await browser.newPage();

  // navigates to the paste site
  await page.goto("https://www.aliexpress.com/", { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => window.stop());


 await page.type('input[name="SearchText"]', product);
 await (await page.$('input[class="search-button"]')).click()

 await page.waitForNavigation();

try {
await (await page.$('a[role="button"][class="next-dialog-close"]')).click()
} catch {null}
     

  await (await page.$('a[class="switcher-info notranslate"]')).click()
  await page.waitForSelector('a[class="address-select-trigger"]', { visible: true })
  await (await page.$('a[class="address-select-trigger"]')).click()
  await page.type('input[class="filter-input"]', country);
  await (await page.$(`li[data-name='${country}']`)).click()
  await (await page.$('button[class="ui-button ui-button-primary go-contiune-btn"]')).click()

await page.waitForNavigation();

try {
await (await page.$('a[role="button"][class="next-dialog-close"]')).click()
} catch {null}


const sortByOrders = await page.$('span[ae_object_value="number_of_orders"]')
await sortByOrders.click()

await timeOut(1000)
 

  await (await page.$('span[class="next-input next-medium next-select-inner"]')).click()
  await (await page.$('li[title="China"]')).click()

await timeOut(1000)

        let links = await page.$$('a[class="item-title"]');

        links = await Promise.all(
          links.map((link) => link.getProperty("href"))
        );

        links = await Promise.all(links.map((link) => link.jsonValue()));

for (let link of links) {
try {
  await page.goto(link, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => window.stop());

try {
await (await page.$('img[class="rax-image"]')).click()
} catch { null }

await page.$$eval('ul[class="sku-property-list"]', 
elements => elements.map(async e => await e.querySelector('li:not(.selected)').click()))

const url = link
const title = await page.$eval('h1[class="product-title-text"]', element => element.textContent)
const price = await page.$eval('span[itemprop="price"]', element => element.textContent)
const reviews = await page.$eval('span[itemprop="reviewCount"]', element => element.textContent)
const rating = await page.$eval('span[itemprop="ratingValue"]', element => element.textContent)
const image = await page.$eval('img[class="magnifier-image"]', element => element.getAttribute('src'))

console.log(
{ title, price, reviews, rating, image, url }
)

} catch { null }
}

await browser.close();

}


// when this function is called the program awaits the time inserted as an argument before executing the next command
function timeOut(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

ebayScrape("Levitating Plant Pot", "United States");

function toPrice(e) {
  var price = e.replace(/[^0-9\.]/g, "");
  return price;
}

module.exports = ebayScrape;
