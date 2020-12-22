const mongoose = require("mongoose");
require("dotenv").config();
const { generateToken } = require('../middlewares/checkToken')

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
  email: String,
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
  
  if (type === 'normal') {
  if (await findUser(user)) return null
  }
  const newUser = new User({
email, name, type, password, token:generateToken(email)
  });
  newUser.save().then(() => {
    return newUser;
  });
};

const findUser = async (user) => {
const { email, type, password, name, token } = user;
let result;
if (type === 'google') {
result = await User.findOne({email}) ? await User.findOneAndUpdate({email}, {token}, { new: true }) : await createUser(user)
} else {
result = await User.findOneAndUpdate({email, password}, {token: generateToken(email)}, { new: true })
}
return result;
};

const findUserByEmail = async (email) => {
let result = await User.findOne({email})
return result;
};


module.exports = { User, createUser, findUser, findUserByEmail };
