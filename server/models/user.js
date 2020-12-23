const mongoose = require("mongoose");
require("dotenv").config();
const { generateToken } = require("../middlewares/checkToken");

mongoose.set("useFindAndModify", false);

const url = process.env.MONGODB_URI;

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  name: String,
  token: String,
  type: String,
  password: String,
});

UserSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const User = mongoose.model("User", UserSchema);

const createUser = async (user) => {
  const { email, name, type, password } = user;
  if (type === "normal" && await findUserByEmail(user)) return null;
  const newUser = new User({
    email,
    name,
    type,
    password,
    token: generateToken(email),
  });
  return await newUser.save().then(() => {
    return newUser;
  });
};

const findUserOrCreate = async (user) => {
  const { email, type, password, name, token } = user;
  let result;
  if (type === "google") {
    result = (await User.findOne({ email }))
      ? await User.findOne({ email })
      : await createUser(user);
  } else {
    result = await User.findOne({ email });
  }
  return result;
};

const findUserByEmail = async (user) => {
  const { email } = user;
  
  return await User.findOne({ email });
};

const findUserAndUpdateToken = async (user) => {
  const { email, token } = user;
  return await User.findOneAndUpdate(
    { email },
    { token: generateToken(email) },
    { new: true }
  );
};

const updateUserPassword = async (user) => {
  const { email, password } = user;
  return await User.updateOne(
    { email },
    { password },
    { new: true }
  );
};


module.exports = {
  User,
  createUser,
  findUserOrCreate,
  findUserByEmail,
  findUserAndUpdateToken,
  updateUserPassword
};
