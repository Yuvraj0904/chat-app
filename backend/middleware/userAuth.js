import jwt from "jsonwebtoken";
const userAuth = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.json({ success: false, message: "not authorized login again" });
  }
  try {
    //check the token match jwt
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    //store the id for verified token
    if (tokenDecode.id) {
      req.userId = tokenDecode.id;
    } else {
      return res.json({
        success: false,
        message: "not authorized login again",
      });
    }
    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
export default userAuth;
