const puppeteer = require("puppeteer");
require("dotenv").config();

const proxies = [
  "us1",
  "us2",
  "us3",
  "us4",
  "us5",
  "us6",
  "us7",
  "us8",
  "us9",
  "us10",
  "us11",
  "us12",
  "us13",
  "us14",
  "us15",
  "us16",
  "us17",
  "eu1",
  "eu2",
  "eu3",
  "eu4",
  "eu5",
  "eu6",
  "eu7",
  "eu8",
  "eu9",
  "eu10",
  "eu11",
  "eu12",
  "eu13",
  "eu14",
  "eu15",
];

async function aliExpressScraper(product, country, sendNotification) {
  try {
    // launches tor browser
    const browser = await puppeteer.launch({
      args: [
        " --no-sandbox",
        "--disable-setuid-sandbox",
        `--proxy-server=socks5://${process.env.TOR_PROXY}:9050`,
      ],
      headless: true,
    });

    sendNotification("Scanning Aliexpress...");
    const page = await browser.newPage();

    await page.setViewport({ width: 0, height: 0 });

    await page.goto("https://www.proxysite.com/", {
      waitUntil: "domcontentloaded",
    });

    await page.select(
      ".server-option",
      proxies[Math.floor(Math.random() * proxies.length)]
    );
    await page.type(
      'input[name="d"]',
      `https://www.aliexpress.com/wholesale?SearchText=${product}&SortType=total_tranpro_desc&shipFromCountry=CN`
    );
    await page.$eval('button[type="submit"]', (element) => element.click());

    sendNotification("Sets Destination Country");

    await timeOut(10000);
    await page.evaluate(() => window.stop());
    await timeOut(500);
    await page.keyboard.press("Escape");

    const title = await page.evaluate(() => document.title);
    if (
      title === "Sorry, we have detected unusual traffic from your network."
    ) {
      console.log(title);
      sendNotification("Error Occured");
      return [];
    }

    await page.evaluate(() => window.scrollBy(0, 1000));
    await timeOut(1000);

    let links = await page.$$('a[class="item-title"]');

    links = await Promise.all(links.map((link) => link.getProperty("href")));

    links = await Promise.all(links.map((link) => link.jsonValue()));

    await page.close();

    const item = async (link) => {
      let page = await browser.newPage();

      try {
        await page.goto(link, { waitForSelector: ".product-shipping-info" });
        await page.evaluate(() => window.stop());

        if (await page.$('img[class="rax-image"]'))
          await page.$$eval('img[class="rax-image"]', (element) =>
            element[1].click()
          );

        const image = await page.$eval(
          'img[class="magnifier-image"]',
          (element) => element.getAttribute("src")
        );

        await page.$$eval('ul[class="sku-property-list"]', (elements) =>
          elements.map(
            async (e) => await e.querySelector("li:not(.selected)").click()
          )
        );

        const url = link;
        const sold = (await page.$('span[class="product-reviewer-sold"]'))
          ? await page.$eval('span[class="product-reviewer-sold"]', (element) =>
              Number(element.textContent.replace(/[^0-9\.]/g, ""))
            )
          : 0;
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

        await timeOut(1000);
        await page.$eval(".product-shipping-info", (element) =>
          element.click()
        );
        await page.waitForSelector('div[class="country-item"]');
        await page.$eval('div[class="country-item"]', (element) =>
          element.click()
        );
        await timeOut(500);
        await page.type('input[id="ae-search-select-1"]', `${country}`);
        await timeOut(500);
        await page.$eval('li[class="next-menu-item"]', (element) =>
          element.click()
        );
        await timeOut(1000);
        const shipping = await page.$$eval(
          'div[class="table-tr"]',
          (elements) => {
            function toDays(e) {
              if (!e.includes("-") && !e.includes("/")) {
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
                  (Date.parse(
                    `${shippingYear}-${shippingMonth}-${shippingDay}`
                  ) -
                    Date.now()) /
                    (1000 * 60 * 60 * 24)
                );
              } else if (e.includes("-")) {
                return e.replace(/[^0-9\-]/g, "").split("-");
              } else {
                return e.replace(/[^0-9\/]/g, "").split("/");
              }
            }
            return elements
              .filter((e) => e.querySelector("label"))
              .map((e) => ({
                days: toDays(e.querySelectorAll(".table-td")[1].textContent),
                price:
                  e.querySelectorAll(".table-td")[2].textContent !==
                  "Free Shipping"
                    ? Number(
                        e
                          .querySelectorAll(".table-td")[2]
                          .textContent.replace(/[^0-9\.]/g, "")
                      )
                    : 0,
                carrier: e.querySelectorAll(".table-td")[4].textContent,
              }));
          }
        );

        await page.close();
        if (shipping.length === 0) return null;
        return {
          title,
          price,
          sold,
          reviews,
          rating,
          image,
          url,
          shipping,
        };
      } catch (err) {
        console.log(err);
        await page.close();
        return null;
      }
    };

    links = links.slice(0, 20);
    let items = [];
    sendNotification("Scanning Links");

    for (let i = 0; i <= links.length && i <= links.length + 10; i += 10) {
      items = items.concat(
        await Promise.allSettled(
          links.slice(i, i + 10).map(async (link) => await item(link))
        )
      );
    }

    sendNotification("Finished Scanning Aliexpress");
    await browser.close();

    return items.filter((e) => e.value !== null).map((e) => e.value);
  } catch (err) {
    sendNotification("Error Occured");
    return null;
  }
}

// when this function is called the program awaits the time inserted as an argument before executing the next command
function timeOut(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

// aliExpressScraper("Levitating Plant Pot", "United States");

module.exports = aliExpressScraper;
