const jtw = require("jsonwebtoken");

const authorization = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization)
    return res.status(401).json({ error: "authorization token is needed!" });

  const token = authorization.split(" ")[1];

  try {
    const decoded = jtw.verify(token, process.env.SECRET);

    req.user = decoded._id;
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = authorization;
