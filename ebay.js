const puppeteer = require("puppeteer");

async function ebayScrape(product, country) {
  // launches tor browser
  const browser = await puppeteer.launch({
    // executablePath: 'google-chrome-stable',
    args: [" --no-sandbox"],
    headless: false,
  });

  const page = await browser.newPage();



  // sets destination country
  await page.goto("https://www.ebay.com/");
  await page.waitForSelector('button[title="Ship to"]', { visible: true })
  await (await page.$('button[title="Ship to"]')).click()
  await page.waitForSelector('div[class="shipto__country-list"]', { visible: true })
  await (await page.$('div[class="shipto__country-list"]')).click()
  const destination = await page.$x(`//span[text()="${country}"]`)
  await destination[0].click()
  await timeOut(500)
  await (await page.$('button[class="shipto__close-btn"]')).click()

  await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
  await page.evaluate(() => window.stop())

  await page.type('input[class="gh-tb ui-autocomplete-input"]', product);

  const button = await page.$("#gh-btn");

  await button.click();
  await page.waitForNavigation();

  let links = await page.$$('a[class="s-item__link"]');

  links = await Promise.all(
    links.map((link) => link.getProperty("href"))
  );

  links = await Promise.all(links.map((link) => link.jsonValue()));

  for (let link of links.slice(0, 20)) {
    try {
      await page.goto(link, { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => window.stop());

      const url = link
      const title = await page.$eval('h1[itemprop="name"]', element => element.textContent.split('Details about')[1].trim())
      const shipping = await page.$eval('span[id="fshippingCost"] > span', element => element.textContent.replaceAll(/[\t\n]+/g, "").trim())
      const sold = await page.$('a[class="vi-txt-underline"]') ? await page.$eval('a[class="vi-txt-underline"]', element => {
        function toPrice(e) {
          var price = e.replace(/[^0-9\.]/g, "");
          return Number(price);
        }; return toPrice(element.textContent)
      }) : 0
      const price = await page.$eval('span[itemprop="price"]', element => {
        function toPrice(e) {
          var price = e.replace(/[^0-9\.]/g, "");
          return Number(price);
        }; return toPrice(element.textContent)
      })
      const image = await page.$eval('img[itemprop="image"]', element => element.getAttribute('src'))

      console.log(
        { title, price, shipping, sold, image, url }
      )

    } catch (err) { console.log(err) }
  }

  await browser.close();

}

// when this function is called the program awaits the time inserted as an argument before executing the next command
function timeOut(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

ebayScrape("leviating flower pot", 'United States');

module.exports = ebayScrape;
