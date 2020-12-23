const puppeteer = require("puppeteer");

async function ebayScraper(product, country, room) {
  const browser = await puppeteer.launch({
    args: [" --no-sandbox", "--disable-setuid-sandbox"],
    headless: true,
  });
  
  sendNotification(room, "Scanning Ebay...");

  const page = await browser.newPage();
  try {

    await page.setViewport({ width: 0, height: 0 });

    await page.goto(`https://www.ebay.com/sch/i.html?_nkw=${product}`);
    // await page.waitForSelector('#gdpr-banner-accept', { visible: true });
    // await page.$eval('#gdpr-banner-accept', (element) => element.click());
    // await timeOut(500);
    // await page.waitForSelector('button[title="Ship to"]', { visible: true });

    await page.waitForSelector('button[title="Ship to"]', {
      visible: true,
    });

    sendNotification(room, "Sets Destination Country");
    await page.$eval('button[title="Ship to"]', (element) => element.click());
    await page.waitForSelector('div[class="shipto__country-list"]', {
      visible: true,
    });
    await (await page.$('div[class="shipto__country-list"]')).click();

    await timeOut(500);
    const destination = await page.$x(`//span[text()="${country}"]`);
    await timeOut(500);

    await destination[0].click();
    await timeOut(500);
    await page.$eval('button[class="shipto__close-btn"]', (element) =>
      element.click()
    );

    await page.waitForNavigation();

    let links = await page.$$('a[class="s-item__link"]');

    links = await Promise.all(links.map((link) => link.getProperty("href")));

    links = await Promise.all(links.map((link) => link.jsonValue()));

    await page.close();

    const item = async (link) => {
      let page = await browser.newPage();
      try {
        await page.goto(link, { waitForSelector: 'span[id="fshippingCost"]' });
        await page.evaluate(() => window.stop());

        const url = link;
        const title = await page.$eval('h1[itemprop="name"]', (element) =>
          element.textContent.split("Details about")[1].trim()
        );

        // add shipping delivery
        let shipping = new Object();
        await timeOut(1000);

        shipping["price"] = await page.$eval(
          'span[id="fshippingCost"]',
          (element) =>
            element
              .querySelector("span")
              .textContent.replaceAll(/[\t\n]+/g, "")
              .trim()
        );

        shipping["price"] !== "FREE"
          ? (shipping["price"] = Number(
              shipping["price"].replace(/[^0-9\.]/g, "")
            ))
          : (shipping["price"] = 0);

        shipping["days"] = await page.$eval(".vi-acc-del-range", (element) => {
          function toDays(e) {
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
            let range = e.split(" and ");
            return range.map((e) => {
              const words = /(\w+)/g;
              const wordsArray = e.match(words);
              let shippingDay = Number(wordsArray.find((e) => Number(e)));
              let shippingMonth =
                months.indexOf(wordsArray.find((e) => months.includes(e))) + 1;
              let shippingYear =
                shippingMonth > new Date().getMonth()
                  ? new Date().getFullYear()
                  : new Date().getFullYear() + 1;
              return Math.floor(
                (Date.parse(`${shippingYear}-${shippingMonth}-${shippingDay}`) -
                  Date.now()) /
                  (1000 * 60 * 60 * 24)
              );
            });
          }
          return toDays(element.querySelector("b").textContent);
        });

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
        //   let seller = new Object
        //   seller['score'] = await page.$eval('span[class="mbg-l"] > a', (element) =>
        //     Number(element.textContent)
        //   );
        //   seller['positive'] = await page.$eval('#si-fb', (element) =>
        //   Number(element.textContent.split('%')[0])
        // );

        await page.close();
        return { title, price, shipping, sold, image, url };
      } catch (err) {
        console.log(err);
        await page.close();
        return null;
      }
    };
    links = links.slice(0, 20);
    let items = [];
    sendNotification(room, "Scanning Links");
    for (let i = 0; i <= links.length && i <= links.length + 10; i += 10) {
      items = items.concat(
        await Promise.allSettled(
          links.slice(i, i + 10).map(async (link) => await item(link))
        )
      );
    }
    sendNotification(room, "Finished Scraping Ebay");
    await browser.close();
    return items.filter((e) => e.value !== null).map((e) => e.value);
  } catch (err) {
    sendNotification(room, 'Error Occured')
    return null;
  }
}

// when this function is called the program awaits the time inserted as an argument before executing the next command
function timeOut(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

module.exports = ebayScraper
const { sendNotification } = require('./app');


