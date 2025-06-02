import User from "../models/Users.js";

//Admin
//leader
//Team

export async function isAdmin(user_id) {
  const user = await User.findOne({ _id: user_id });
  return user.role === "Admin";
}

export const getRole = async (user_id) => {
  const user = await User.findOne({ _id: user_id });
  return user.role;
};
