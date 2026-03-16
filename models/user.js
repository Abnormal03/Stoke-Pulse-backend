const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const UserSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      required: false,
      default: 10000,
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.statics.signupUser = async function (userName, email, password) {
  if (!userName || !email || !password) throw Error("All fields are required!");

  if (!validator.isEmail(email)) throw Error("invalid email!");
  if (!validator.isStrongPassword(password))
    throw Error("the password should be more strong");

  const exists = await this.findOne({ email });
  if (exists) throw Error("email already in use!");

  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(password, salt);

  const user = await this.create({
    userName,
    email,
    password: hashPass,
    balance: 10000,
  });
  return user;
};

UserSchema.statics.loginUser = async function (email, password) {
  if (!email || !password) throw Error("All fields are required!");
  if (!validator.isEmail(email)) throw Error("invalid email!");

  const user = await this.findOne({ email });

  if (!user) {
    throw Error("invalid credentials!");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw Error("invalid credentials!");
  return user;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
