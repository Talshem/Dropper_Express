const mongoose = require("mongoose");
require("dotenv").config();
const { generateToken, TYPE } = require("../middlewares/checkToken");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

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
  if (type === TYPE.NORMAL && (await findUserByEmail(user))) return null;
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
  const { email, type, password, name } = user;
  let userExist = await User.findOne({ email, type });
  if (type === TYPE.GOOGLE) {
    if (userExist) {
      return userExist;
    } else if (await User.findOne({ email })) {
      return null;
    } else {
      return await createUser(user);
    }
  }
  return userExist;
};

const findUserByEmail = async (user) => {
  const { email } = user;
  return await User.findOne({ email });
};

const findUserAndUpdateToken = async (user) => {
  const { email } = user;
  return await User.findOneAndUpdate(
    { email },
    { token: generateToken(email) },
    { new: true }
  );
};

const updateUserPassword = async (user) => {
  const { email, password } = user;
  return await User.findOneAndUpdate({ email }, { password }, { new: true });
};

module.exports = {
  User,
  createUser,
  findUserOrCreate,
  findUserByEmail,
  findUserAndUpdateToken,
  updateUserPassword,
};
