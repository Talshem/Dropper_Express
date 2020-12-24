const express = require("express");
const unknownEndpoint = require("./middlewares/errorHandler");
const fs = require("fs");
const {
  createUser,
  findUserOrCreate,
  findUserByEmail,
  updateUserPassword,
  findUserAndUpdateToken,
} = require("./models/user");
const redis = require("redis");
const { verifyToken, TYPE } = require("./middlewares/checkToken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const mailer = require('./helpers/mailer')

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

const sendNotification = (room, message) => io.emit(room, message);

const bluebird = require("bluebird");
bluebird.promisifyAll(redis);
const client = redis.createClient();

client.on("connect", function () {
  console.log("connected to redis");
});

app.get("/scrape", async (req, res) => {
  const { authorization, type } = req.headers;
  if (!(await verifyToken(authorization, type)))
    return res.status(404).send("Permission Denied");
  const { product, email, index } = req.query;
  const room = `${email}${index}`;
  try {
    client.rpush("search", product);
    client.del(`${email}${index}`);
    const ebay = await ebayScraper(product, "United States", room);
    const aliexpress = await aliExpressScraper(product, "United States", room);
    sendNotification(room, "Saves Data");
    if (ebay.length > 0 && aliexpress.length > 0) {
      client.set(
        `${email}${index}`,
        JSON.stringify({ ebay, aliexpress, product })
      );
      client.expire(`${email}${index}`, 1 * 60 * 60 * 24);
    }
    sendNotification(room, false);
    return res.send({ ebay, aliexpress });
  } catch (err) {
    sendNotification(room, false);
    console.log("failure", err);
    return res.send(err);
  }
});

//mock data for testing
const aliexpressMock = JSON.parse(fs.readFileSync("./aliexpressMock.json"));
const ebayMock = JSON.parse(fs.readFileSync("./ebayMock.json"));
const data = { aliexpressMock, ebayMock };

app.get("/history/:email", async (req, res) => {
  const { authorization, type } = req.headers;
  if (!(await verifyToken(authorization, type)))
    return res.status(404).send("Permission Denied");
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
    console.log(err);
    return res.send(err);
  }
});


app.delete("/clearCache/:key", async (req, res) => {
  const { authorization, type } = req.headers;
  if (!(await verifyToken(authorization, type)))
    return res.status(404).send("Permission Denied");
    const { key } = req.params;
  try {
    client.del(key);
    return res.send('Success');
  } catch (err) {
    console.log(err);
    return res.status(400).send('Failure');
  }
});

app.post("/signup", async (req, res) => {
  const { email, name, type, password } = req.body;
  try {
    return bcrypt.hash(
      password,
      saltRounds,
      async function (err, hashedPassword) {
        if (err) return res.send(null);
        const results = await createUser({
          email,
          name,
          type,
          password: hashedPassword,
        });
        return res.send(results);
      }
    );
  } catch (err) {
    return res.send(err);
  }
});

app.get("/auto", async (req, res) => {
  const { authorization, type } = req.headers;
  try {
    let token = await verifyToken(authorization, type);
    let result = null;
    if (token) {
      result = await findUserByEmail({email:token.email});

    }
    return res.send(result);
  } catch (err) {
    return res.send(err);
  }
});

app.put("/login", async (req, res) => {
  const { email, type, password, name, token } = req.body;
  try {
    const user = await findUserOrCreate({
      email,
      type,
      password,
      name,
      token,
    });
    if (!user) return res.send(user);
    if (user && type === TYPE.GOOGLE) return res.send(user);
    return bcrypt.compare(
      password,
      user.password,
      async function (err, result) {
        if (err || !result) return res.send(null);
        return res.send(await findUserAndUpdateToken(user));
      }
    );
  } catch (err) {
    return res.send(err);
  }
});

app.post("/passwordReset", async (req, res) => {
  const { email } = req.body;
  const user = await findUserByEmail({email});
  if (!user) return res.status(400).json({ message: "User doesn't exist" });
  try {
    const resetToken = jwt.sign(
      {email},
      process.env.EMAIL_TOKEN_SECRET,
      {expiresIn: "1h"}
      );
    return mailer.sendHTMLMail(
      req.body.email,
      "Reset Your Password",
      `<p>
Please fill up the following input with your desired new password.
</p>
<form action="${process.env.IP_ADDRESS}/resetAuth" method="GET">
<input name="token" value="${resetToken}" type="hidden">
<br>
<input name="password" type="text">
<button style="width: 200px; background-color: grey; color: white;">Reset</button>
</form>`,
      (error, info) => {
        if (error) return res.status(400).json({ message: "Email Invalid" });
      }
    );
  } catch (error) {
    return res.status(400).json({ message: "Cannot process request" });
  }
});

app.get("/resetAuth", async (req, res) => {
  const { token, password } = req.query;
  try {
    return jwt.verify(
      token,
      process.env.EMAIL_TOKEN_SECRET,
      (error, decoded) => {
        if (error) return res.status(404).send("Verification has failed, couldn't complete proccess");
        bcrypt.hash(password, saltRounds, async function (err, hashedPassword) {
          if (err) return res.status(404).send("Undetected Error");
          await updateUserPassword({
            email: decoded.email,
            password: hashedPassword,
          });
          return res.send("Password has been successfully changed");
        });
      }
    );
  } catch (err) {
    res.status(404).send(err);
  }
});

app.get("/ebayMock", async (req, res) => {
  return res.send(data.ebayMock);
});

app.get("/aliexpressMock", async (req, res) => {
  return res.send(data.aliexpressMock);
});

app.use(unknownEndpoint);

module.exports = { server, sendNotification };

const ebayScraper = require("./ebay");
const aliExpressScraper = require("./aliexpress");
