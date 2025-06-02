import jwt from "jsonwebtoken";

const generateToken = (id, phone) => {
  const payload = {
    userId: id,
    phone: phone,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export default generateToken;
