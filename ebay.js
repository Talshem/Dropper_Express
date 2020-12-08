const puppeteer = require("puppeteer");

async function ebayScraper(product, countries) {
const browser = await puppeteer.launch({
  // executablePath: 'google-chrome-stable',
  args: [" --no-sandbox"],
  headless: false,
});

const scrapeInstance = async (product, country) => {
  const page = await browser.newPage();

  // sets destination country
  await page.goto("https://www.ebay.com/");
  await page.waitForSelector('button[title="Ship to"]', { visible: true });
  await page.$eval('button[title="Ship to"]', (element) => element.click());
  await page.waitForSelector('div[class="shipto__country-list"]', {
    visible: true,
  });
  await (await page.$('div[class="shipto__country-list"]')).click();

  const destination = await page.$x(`//span[text()="${country}"]`);
  await timeOut(500);

  await destination[0].click();
  await timeOut(500);
  await page.$eval('button[class="shipto__close-btn"]', (element) =>
    element.click()
  );

  await page.waitForNavigation({ waitUntil: "domcontentloaded" });
  await page.evaluate(() => window.stop());

  await page.type('input[class="gh-tb ui-autocomplete-input"]', product);

  const button = await page.$("#gh-btn");

  await button.click();
  await page.waitForNavigation();

  let links = await page.$$('a[class="s-item__link"]');

  links = await Promise.all(links.map((link) => link.getProperty("href")));

  links = await Promise.all(links.map((link) => link.jsonValue()));

  const products = [];

  for (let link of links.slice(0, 20)) {
    try {
      await page.goto(link, { waitUntil: "domcontentloaded" });
      await page.evaluate(() => window.stop());

      const url = link;
      const title = await page.$eval('h1[itemprop="name"]', (element) =>
        element.textContent.split("Details about")[1].trim()
      );
      let shipping = (await page.$('span[id="fshippingCost"] > span'))
        ? await page.$eval('span[id="fshippingCost"] > span', (element) =>
            element.textContent.replaceAll(/[\t\n]+/g, "").trim()
          )
        : null;
      shipping =
        shipping === "FREE"
          ? Number(shipping.replace(/[^0-9\.]/g, ""))
          : shipping
          ? 0
          : null;
      const sold = (await page.$('a[class="vi-txt-underline"]'))
        ? await page.$eval('a[class="vi-txt-underline"]', (element) =>
            Number(element.textContent.replace(/[^0-9\.]/g, ""))
          )
        : 0;
      const price = await page.$eval('span[itemprop="price"]', (element) =>
        Number(element.textContent.replace(/[^0-9\.]/g, ""))
      );
      const image = await page.$eval('img[itemprop="image"]', (element) =>
        element.getAttribute("src")
      );

      products.push({ title, price, shipping, sold, image, url });
    } catch (err) {
      console.log(err);
    }
  }
await page.close();
return products;
}

const results = await Promise.allSettled(countries.map(async country => {
     return ({[country]: await scrapeInstance(product, country)})
  }))

  await browser.close();
  return results.map(e => e.value);
}

// when this function is called the program awaits the time inserted as an argument before executing the next command
function timeOut(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

module.exports = ebayScraper;
