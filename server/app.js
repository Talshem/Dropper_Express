const express = require("express");
const unknownEndpoint = require("./middlewares/errorHandler");
const ebayScraper = require("./ebay");
const aliExpressScraper = require("./aliexpress");
const fs = require("fs");
const { createUser, findUser, findUserByEmail } = require("./models/user");
const redis = require("redis");
const {
  verifyNormalToken,
  verifyGoogleToken,
} = require("./middlewares/checkToken");



const bluebird = require("bluebird");
bluebird.promisifyAll(redis);
const client = redis.createClient();

client.on("connect", function () {
  console.log("connected to redis");
});

const app = express();
app.use(express.json());

//mock data for testing
const aliexpressMock = JSON.parse(fs.readFileSync("./aliexpressMock.json"));
const ebayMock = JSON.parse(fs.readFileSync("./ebayMock.json"));
const data = { aliexpressMock, ebayMock };

app.get("/history/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const results = {
      tab1:
        (await client.getAsync(`${email}1`)) &&
        JSON.parse(await client.getAsync(`${email}1`)),
      tab2:
        (await client.getAsync(`${email}2`)) &&
        JSON.parse(await client.getAsync(`${email}2`)),
      tab3:
        (await client.getAsync(`${email}3`)) &&
        JSON.parse(await client.getAsync(`${email}3`)),
      tab4:
        (await client.getAsync(`${email}4`)) &&
        JSON.parse(await client.getAsync(`${email}4`)),
      tab5:
        (await client.getAsync(`${email}5`)) &&
        JSON.parse(await client.getAsync(`${email}5`)),
    };
    return res.send(results);
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
});

app.post("/signup", async (req, res) => {
  const { email, name, type, password } = req.body;
  try {
    const results = await createUser({ email, name, type, password });
    return res.send(results);
  } catch (err) {
    return res.send(err);
  }
});

app.get("/auto", async (req, res) => {
  const { authorization, type } = req.headers;
  try {
    let token =
      type === "google"
        ? await verifyGoogleToken(authorization)
        : verifyNormalToken(authorization);
    let result = null;
    if (token) {
      result = await findUserByEmail(token.email);
    }
    return res.send(result);
  } catch (err) {
    return res.send(err);
  }
});

app.put("/login", async (req, res) => {
  const { email, type, password, name, token } = req.body;
  try {
    const results = await findUser({ email, type, password, name, token });
    return res.send(results);
  } catch (err) {
    return res.send(err);
  }
});

app.get("/scrape", async (req, res) => {
  const { product, email, index } = req.query;
  try {
    console.log("Scraping Ebay...");
    const ebay = await ebayScraper(product, "United States");

    console.log("Scraping Aliexpress...");
    const aliexpress = await aliExpressScraper(product, "United States");

    if (ebay.length > 0 && aliexpress.length > 0) {
      client.set(`${email}${index}`, JSON.stringify({ ebay, aliexpress, product }));
      client.expire(`${email}${index}`, 1 * 60 * 60 * 24);
    }
    return res.send({ ebay, aliexpress });
  } catch (err) {
    console.log("failure", err);
    return res.send(err);
  }
});

app.get("/ebayMock", async (req, res) => {
  return res.send(data.ebayMock);
});

app.get("/aliexpressMock", async (req, res) => {
  return res.send(data.aliexpressMock);
});

app.use(unknownEndpoint);

module.exports = app;
