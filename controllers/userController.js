const jwt = require("jsonwebtoken");

const User = require("../models/user");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};
const signupUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.signupUser(username, email, password);

    const token = createToken(user._id);

    res.status(200).json({ email: email, token: token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.loginUser(email, password);

    const token = createToken(user._id);
    res.status(200).json({ email, token: token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { signupUser, loginUser };
