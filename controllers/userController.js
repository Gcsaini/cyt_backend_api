import expressAsyncHandler from "express-async-handler";
import Users from "../models/Users.js";
import { deleteFile } from "../services/fileUpload.js";
import UserInfo from "../models/UserInfo.js";
export const getProfile = expressAsyncHandler(async (req, res, next) => {
  const user_id = req.user._id;
  try {
    const user = await Users.findById(user_id).select(
      "name phone email profile bio"
    );
    if (user) {
      res.status(200).json({
        data: user,
        status: true,
        message: "Found",
      });
    } else {
      res.status(400);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(400);
    throw new Error("Something went wrong");
  }
});

export const updateUser = expressAsyncHandler(async (req, res, next) => {
  const user = req.user;
  const { name, nickname, phone, dob, anumber, state, gender, age } = req.body;
  try {
    let profile = "";
    if (req.file) {
      profile = req.file.filename;
      // const fileContent = fs.readFileSync(req.file.path);
      // profile = await getPutObjectUrl(filename, fileContent, "image");
      // deleteFile(req.file.path);
    }
    const filter = { _id: user._id };
    const update = {
      $set: {
        nickname: nickname,
        dob: dob,
        anumber: anumber,
        state: state,
        gender: gender,
        age: age,
      },
    };
    const options = { upsert: true };
    if (profile === "" && name === user.name && phone === user.phone) {
      await UserInfo.updateOne(filter, update, options);
      res.status(200).json({
        data: [],
        status: true,
        message: "Profile updated successfully",
      });
    } else {
      await Users.findByIdAndUpdate(
        user._id,
        { profile, name, phone },
        { new: true }
      );

      // upsert option
      await UserInfo.updateOne(filter, update, options);
      res.status(200).json({
        data: [],
        status: true,
        message: "Profile updated successfully",
      });
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const getUser = expressAsyncHandler(async (req, res, next) => {
  const user = req.user;
  try {
    if (user.role === 1) {
      res.status(201).json({
        message: "Fetched successfully",
        data: {
          name: user.name,
          phone: user.phone,
          email: user.email,
          bio: user.bio,
          profile: user.profile,
        },
        status: true,
      });
    } else {
      const userInfo = await UserInfo.findById(user._id);

      res.status(201).json({
        message: "Fetched successfully",
        data: {
          name: user.name,
          phone: user.phone,
          email: user.email,
          bio: user.bio,
          profile: user.profile,
          nickname: userInfo ? userInfo.nickname : "",
          anumber: userInfo ? userInfo.anumber : "",
          dob: userInfo ? userInfo.dob : "",
          age: userInfo ? userInfo.age : "",
          state: userInfo ? userInfo.state : "",
          gender: userInfo ? userInfo.gender : "",
        },
        status: true,
      });
    }
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});
