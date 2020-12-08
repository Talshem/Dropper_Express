const puppeteer = require("puppeteer");

async function aliExpressScraper(product, countries) {
  // launches tor browser
  const browser = await puppeteer.launch({
    // executablePath: 'google-chrome-stable',
    args: [" --no-sandbox"],
    headless: true,
  });

const scrapeInstance = async (product, country) => {
  const page = await browser.newPage();

  // navigates to the paste site
  await page.goto("https://www.aliexpress.com/", {
    waitUntil: "domcontentloaded",
  });
  await page.evaluate(() => window.stop());

  await page.type('input[name="SearchText"]', product);
  await page.$eval('input[class="search-button"]', element => element.click())

  await page.waitForNavigation();
  await timeOut(500)

  try {
    await page.$eval('a[role="button"][class="next-dialog-close"', element => element.click())
  } catch {
    null;
  }
  await timeOut(500)

  await page.$eval('a[class="switcher-info notranslate"]', element => element.click());
  await page.waitForSelector('a[class="address-select-trigger"]', {
    visible: true,
  });
  await page.$eval('a[class="address-select-trigger"]', element => element.click());
  await page.type('input[class="filter-input"]', country);
  await page.$eval(`li[data-name='${country}']`, element => element.click());
  
  await page.$eval('button[class="ui-button ui-button-primary go-contiune-btn"]', element => element.click())

  await page.waitForNavigation();

  try {
    await page.$eval('a[role="button"][class="next-dialog-close"', element => element.click())
  } catch {
    null;
  }

await page.$eval('span[ae_object_value="number_of_orders"]', element => element.click());

  await timeOut(1000);

  await page.$eval('span[class="next-input next-medium next-select-inner"', element => element.click())
  await page.$eval('li[title="China"', element => element.click())

  await timeOut(1000);

  let links = await page.$$('a[class="item-title"]');

  links = await Promise.all(links.map((link) => link.getProperty("href")));

  links = await Promise.all(links.map((link) => link.jsonValue()));

const products = []

  for (let link of links.slice(0,20)) {
    try {
      await page.goto(link, { waitUntil: "domcontentloaded" });
      await page.evaluate(() => window.stop());

      try {
        await page.$eval('img[class="rax-image"]', element => element.click())
      } catch {
        null;
      }

      await page.$$eval('ul[class="sku-property-list"]', (elements) =>
        elements.map(
          async (e) => await e.querySelector("li:not(.selected)").click()
        )
      );

      const url = link;
      const sold = await page.$eval(
        'span[class="product-reviewer-sold"]',
        (element) => Number(element.textContent.replace(/[^0-9\.]/g, ""))
      );
      const title = await page.$eval(
        'h1[class="product-title-text"]',
        (element) => element.textContent
      );
      const price = await page.$eval('span[itemprop="price"]', (element) =>
        Number(element.textContent.replace(/[^0-9\.]/g, ""))
      );
      const reviews = (await page.$('span[itemprop="reviewCount'))
        ? await page.$eval('span[itemprop="reviewCount"]', (element) =>
          Number(element.textContent.replace(/[^0-9\.]/g, ""))
        )
        : 0;
      const rating = (await page.$('span[itemprop="ratingValue'))
        ? await page.$eval('span[itemprop="ratingValue"]', (element) =>
          Number(element.textContent.replace(/[^0-9\.]/g, ""))
        )
        : null;
      const image = await page.$eval(
        'img[class="magnifier-image"]',
        (element) => element.getAttribute("src")
      );

      await timeOut(500);

      await page.$eval(".product-shipping-info", (element) => element.click());
      await page.waitForSelector('div[class="table-tr active"]', {
        visible: true,
      });
      const shipping = await page.$$eval(
        'div[class="table-tr"]',
        (elements) => {
          function toDays(e) {
            if (!e.includes("-")) {
              const months = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ];
              let shippingDay = e.split("  ")[1];
              let shippingMonth = months.indexOf(e.split("  ")[0]) + 1;
              let shippingYear =
                shippingMonth > new Date().getMonth()
                  ? new Date().getFullYear()
                  : new Date().getFullYear() + 1;
              return Math.floor(
                (Date.parse(`${shippingYear}-${shippingMonth}-${shippingDay}`) -
                  Date.now()) /
                (1000 * 60 * 60 * 24)
              );
            } else {
              return e.replace(/[^0-9\-]/g, "").split("-");
            }
          }
          return elements.filter(e => e.querySelector('label')).map(e => ({
            days: toDays(e.querySelectorAll(".table-td")[1].textContent),
            price:
              e.querySelectorAll(".table-td")[2].textContent !== "Free Shipping"
                ? Number(e.querySelectorAll(".table-td")[2].textContent.replace(/[^0-9\.]/g, ""))
                : 0,
            carrier: e.querySelectorAll(".table-td")[4].textContent,
          }));
        }
      );

      products.push({
        title,
        price,
        sold,
        reviews,
        rating,
        image,
        url,
        shipping,
      });

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

// aliExpressScraper("Levitating Plant Pot", "United States");

module.exports = aliExpressScraper;
