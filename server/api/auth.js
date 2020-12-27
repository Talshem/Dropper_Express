const { Router } = require('express');
const {
  createUser,
  findUserOrCreate,
  findUserByEmail,
  updateUserPassword,
  findUserAndUpdateToken,
} = require("../models/user");

const bcrypt = require("bcryptjs");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const mailer = require("../helpers/mailer");
const { verifyToken, TYPE } = require('../middlewares/checkToken')
const router = Router();

router.post("/register", async (req, res) => {
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

router.get("/auto", async (req, res) => {
  const { authorization } = req.headers;
  try {
    let token = verifyToken(authorization);
    let result = null;
    if (token) {
      result = await findUserAndUpdateToken({ email: token.email });
    }
    return res.send(result);
  } catch (err) {
    return res.send(err);
  }
});

router.put("/login", async (req, res) => {
  const { email, type, password, name } = req.body;
  try {
    const user = await findUserOrCreate({
      email,
      type,
      password,
      name,
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

router.post("/passwordReset", async (req, res) => {
  const { email } = req.body;
  const user = await findUserByEmail({ email });
  if (!user) return res.status(400).json({ message: "User doesn't exist" });
  try {
    const resetToken = jwt.sign({ email }, process.env.EMAIL_TOKEN_SECRET, {
      expiresIn: "1h",
    });
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

router.get("/resetAuth", async (req, res) => {
  const { token, password } = req.query;
  try {
    return jwt.verify(
      token,
      process.env.EMAIL_TOKEN_SECRET,
      (error, decoded) => {
        if (error)
          return res
            .status(404)
            .send("Verification has failed, couldn't complete proccess");
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

module.exports = router;