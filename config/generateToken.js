import jwt from "jsonwebtoken";

const generateToken = (id, role) => {
  const payload = {
    userId: id,
    role: role,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export default generateToken;
