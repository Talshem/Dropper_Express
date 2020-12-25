const express = require("express");
const unknownEndpoint = require("./middlewares/errorHandler");
const redis = require("redis");
const { verifyToken } = require("./middlewares/checkToken");
const authRouter = require("./api/auth");

const ebayScraper = require("./scrapers/ebay");
const aliExpressScraper = require("./scrapers/aliexpress");

require("dotenv").config();

const app = express();
app.use(express.json());

const http = require("http");
const server = http.createServer(app);

const socketIo = require("socket.io");
const io = socketIo(server);

// -----------------------------------------------------------------------------------------

io.sockets.on("connection", (socket) => {
  console.log("Client Connected!");

  socket.on("disconnect", () => {
    console.log("Client Disconnected!");
  });
});

const bluebird = require("bluebird");
bluebird.promisifyAll(redis);
const client = redis.createClient(process.env.REDIS_URL);

client.on("connect", function () {
  console.log("connected to redis");
});

// -----------------------------------------------------------------------------------------

app.use(authRouter);

app.get("/scrape", async (req, res) => {
  const { authorization } = req.headers;
  if (!verifyToken(authorization))
    return res.status(404).send("Permission Denied");
  const { product, email, index } = req.query;
  const room = `${email}${index}`;
  const sendNotification = (message) => io.emit(room, message);
  try {
    client.rpush("search", product);
    client.del(`${email}${index}`);
    const ebay = await ebayScraper(product, "United States", sendNotification);
    const aliexpress = await aliExpressScraper(
      product,
      "United States",
      sendNotification
    );
    sendNotification("Saves Data");
    if (ebay.length > 0 && aliexpress.length > 0) {
      client.set(
        `${email}${index}`,
        JSON.stringify({ ebay, aliexpress, product })
      );
      client.expire(`${email}${index}`, 1 * 60 * 60 * 24);
    }
    sendNotification(false);
    return res.send({ ebay, aliexpress });
  } catch (err) {
    sendNotification(false);
    console.log("failure", err);
    return res.send(err);
  }
});

app.get("/history/:email", async (req, res) => {
  const { authorization } = req.headers;
  if (!verifyToken(authorization)) {
    return res.status(404).send("Permission Denied");
  }
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
      search:
        (await client.lrangeAsync("search", -11, -1)) &&
        (await client.lrangeAsync("search", -11, -1)),
    };
    return res.send(results);
  } catch (err) {
    return res.send(err);
  }
});

app.delete("/clearCache/:key", async (req, res) => {
  const { authorization } = req.headers;
  if (!verifyToken(authorization))
    return res.status(404).send("Permission Denied");
  const { key } = req.params;
  try {
    client.del(key);
    return res.send("Success");
  } catch (err) {
    console.log(err);
    return res.status(400).send("Failure");
  }
});

app.use(unknownEndpoint);

module.exports = { server };
