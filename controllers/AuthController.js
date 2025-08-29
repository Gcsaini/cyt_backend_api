import expressAsyncHandler from "express-async-handler";
import Joi from "joi";
import mongoose from "mongoose";
import passwordComplexity from "joi-password-complexity";
import generateToken from "../config/generateToken.js";
import Users from "../models/Users.js";
import Admin from "../models/Admin.js";
import Therapists from "../models/Therapists.js";
import { sendMail } from "../helper/mailer.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { getTimeDifferenceInSeconds } from "../helper/time.js";
import { generate6DigitOTP, generateProfileCode } from "../helper/generate.js";

export const therapistRegister = expressAsyncHandler(async (req, res, next) => {
  if (!req.file) {
    res.status(400);
    return next(new Error("No file uploaded"));
  } else {
    const registerSchema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      type: Joi.string().required(),
      serve: Joi.string().required(),
      email: Joi.string().email().required(),
      mode: Joi.number().required(),
      phone: Joi.number()
        .integer()
        .min(10 ** 9)
        .max(10 ** 10 - 1)
        .required()
        .messages({
          "number.min": "Please enter a valid 10-digit phone number.",
          "number.max": "Please enter a valid 10-digit phone number.",
        }),
    });
    try {
      const { error } = registerSchema.validate(req.body);

      if (error) {
        res.status(400);
        return next(new Error(error));
      }
      const { phone, name, type, mode, serve } = req.body;
      const email = req.body.email.toLowerCase();
      const userExists = await Users.findOne({ email });

      if (userExists) {
        res.status(400);
        return next(new Error("This user is already registred with us"));
      }
      if (userExists && userExists.is_verified === 0) {
        res.status(400);
        return next(new Error("Your ID is not aproved yet by Admin"));
      }

      if (!req.file || req.file == null) {
        res.status(400);
        return next(new Error("Please uplolad you resume."));
      } else {
        if (req.file.size > 200 * 1024) {
          res.status(400);
          return next(new Error("File size should be less than 200KB!"));
        }
      }
      let url = req.file.filename;
      const otp = generate6DigitOTP();
      const subject = "Welcome to CYT";
      const text = `Hello Thank you for registering.Best regards,CYT`;

      const html = `<p>Hello ${name},</p><p>Thank you for registering.</p><p>Use the below otp to verify account</p><p>Otp:${otp}</p>`;

      const user = await Users.create({
        name: name,
        email: email,
        phone: phone.toString(),
        otp,
        otp_count: 1,
        is_verified: 0,
        role: 1
      });
      if (user) {
        await sendMail(email, subject, text, html);
        await Therapists.create({
          user:user._id,
          profile_type: type,
          mode,
          serve_type: serve,
          resume: url,
          profile_code: generateProfileCode()
        })
        res.status(201).json({
          status: true,
          message:
            "Thank you for submitting your resume. Our admin will review your profile soon. You will receive approval via email.",
          data: {
            name: user.name,
            email: user.email,
            phone: user.phone
          },
        });
      } else {
        res.status(400);
        return next(new Error("Failed to create user"));
      }
    } catch (err) {
      return next(new Error(err.message));
    }
  }
});

export const aproveTherapist = expressAsyncHandler(async (req, res, next) => {
  const userId = req.params.userId;
  if (!userId) {
    res.status(400);
    return next(new Error("Please pass user ID"));
  }
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400);
      return next(new Error("Invalid user ID format"));
    }
    const userExists = await Therapists.findById(userId);

    if (!userExists) {
      res.status(400);
      return next(new Error("This user is not exists"));
    }

     const subject = "Approved profile";
    const text = `Thank you for registering with Choose Your Therapist.`;

    const html = `<p>Dear ${userExists.name},</p><p>Thank you for registering with Choose Your Therapist.
                </p><p>We are pleased to inform you that your profile has been successfully approved. Below are your credentials to log in to your account:
                </p><p>Email - ${userExists.email}</p><p><b>Login Credentials:</b></p><p><b>Email:</b> ${userExists.email}</p><p>You can now access your profile and start offering your services to clients. Please follow the link below to log in:</p><p></br><b><a href="chooseyourtherapist.in/login">Login Here</a></b></p><p></br>If you encounter any issues or have any questions, please do not hesitate to reach out to our support team at support@chooseyourtherapist.in.</p>`;

    const isMailSent = await sendMail(userExists.email, subject, text, html);

    const is_aproved = 1;
    let is_mail_sent = isMailSent ? 1 : 0;

    const randomNumber = crypto.randomInt(10000000, 100000000); // Generates a random number between 100000 and 999999
    const profile_code = `CYT${randomNumber}`;
    const priority = 0;

    const updatedUser = await Therapists.findByIdAndUpdate(
      userId,
      { is_aproved, is_mail_sent, profile_code, priority },
      { new: true }
    );

    await Users.create({
      _id: userExists._id,
      name: userExists.name,
      email: userExists.email,
      phone: userExists.phone.toString(),
      role: 1,
      is_verified: 1,
    });

    if (!updatedUser) {
      res.status(400);
      return next(new Error("Failed to update user"));
    }

    res.status(201).json({
      message: "Therapist aproved successfully",
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
      },
      status: true,
    });
  } catch (error) {
    res.status(400);
    return next(new Error(error));
  }
});

export const sendAproveMail = expressAsyncHandler(async (req, res, next) => {
  const userId = req.params.userId;
  if (!userId) {
    res.status(400);
    return next(new Error("Please pass user ID"));
  }
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400);
      return next(new Error("Invalid user ID format"));
    }
    const userExists = await Therapists.findById(userId);

    if (!userExists) {
      res.status(400);
      return next(new Error("This user is not exists"));
    }

     const subject = "Welcome to CYT";
    const text = `Hello Thank you for registering.Best regards,CYT`;

    const html = `<p>Hello ${userExists.name},</p><p>Thank you for registering.</p><p>Best regards,CYT<br>Use the below credentials to login</p><p>Email - ${userExists.email}</p>`;
    const isMailSent = await sendMail(userExists.email, subject, text, html);

    let is_mail_sent = isMailSent ? 1 : 0;

    const updatedUser = await Therapists.findByIdAndUpdate(
      userId,
      { is_mail_sent },
      { new: true }
    );
   
    if (!updatedUser) {
      res.status(400);
      return next(new Error("Failed to update user"));
    }

    res.status(201).json({
      message: "Mail has been sent successfully",
      data: {},
      status: true,
    });
  } catch (error) {
    res.status(400);
    return next(new Error(error));
  }
});

export const register = expressAsyncHandler(async (req, res, next) => {
  const registerSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.number()
      .integer()
      .min(10 ** 9)
      .max(10 ** 10 - 1)
      .required()
      .messages({
        "number.min": "Mobile number should be 10 digit.",
        "number.max": "Mobile number should be 10 digit",
      }),
  });

  const { error } = registerSchema.validate(req.body);

  if (error) {
    return next(error);
  }

  const { name, phone } = req.body;
  let email = req.body.email;

  try {
    email = email.toLowerCase();

    const userExists = await Users.findOne({ email });
    let otp = generate6DigitOTP();
    const subject = "Welcome to CYT";
    const text = `Hello Thank you for registering.Best regards,CYT`;

    const html = `<p>Hello ${name},</p><p>Thank you for registering.</p><p>Use the below otp to verify account</p><p>Otp:${otp}</p>`;

    if (userExists) {
      if (
        userExists.otp_count >= 5 &&
        getTimeDifferenceInSeconds(userExists.updatedAt) < 3600
      ) {
        res.status(400);
        throw new Error(
          `Can't send otp! Maximum limit exceeded.Please try after ${parseInt(
            getTimeDifferenceInSeconds(userExists.updatedAt) / 3600
          )} hour.`
        );
      } else if (
        userExists.otp_count <= 5 &&
        getTimeDifferenceInSeconds(userExists.updatedAt) < 30
      ) {
        res.status(400);
        throw new Error("Unable to send OTP");
      } else {
        userExists.otp = otp;
        userExists.otp_count = userExists.otp_count + 1;
        await userExists.save();
        await sendMail(email, subject, text, html);
        res.status(201).json({
          message: "Otp has been sent to your mail id",
          data: {},
          status: true,
        });
      }
    } else {
      let otp_count = 1;
      await sendMail(email, subject, text, html);
      const user = await Users.create({
        name,
        email,
        phone,
        otp,
        otp_count,
      });
      if (user) {
        res.status(201).json({
          message: "Otp has been sent to your mail id",
          data: {},
          status: true,
        });
      } else {
        res.status(400);
        throw new Error("Failed to create user");
      }
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const sendOtpToMail = expressAsyncHandler(async (req, res) => {
  let email = req.body.email.toLowerCase();

  if (email) {
    try {
      const otp = Math.floor(Math.random() * 1000000);
      const subject = "Welcome to CYT";
      const text = `Hello Thank you for registering.Best regards,CYT`;
      const html = `<p>Hello User,Please get the one time password to validate you.<br/><p>OTP - ${otp}</p>`;
      const isMailSent = await sendMail(email, subject, text, html);
      if (isMailSent) {
        res.status(201).json({
          message: "Otp has been sent to your mail id",
          data: {},
          status: true,
        });
      } else {
        res.status(400);
        return next(new Error("Please enter valid mail id"));
      }
    } catch (err) {
      res.status(400);
      return next(new Error(err.message));
    }
  } else {
    res.status(400);
    return next(new Error("Please enter email id"));
  }
});

export const sendForgotPasswordOtp = expressAsyncHandler(
  async (req, res, next) => {
    const validateSchema = Joi.object({
      email: Joi.string().email().required(),
    });
    const { error } = validateSchema.validate(req.body);

    if (error) {
      res.status(400);
      return next(new Error(error));
    }

    try {
      let email = req.body.email.toLowerCase();
      const user = await Users.findOne({ email });
      if (user) {
        if (
          user.otp_count >= 5 &&
          getTimeDifferenceInSeconds(user.updatedAt) < 3600
        ) {
          res.status(400);
          throw new Error(
            `Can't send otp! Maximum limit exceeded.Please try after ${parseInt(
              getTimeDifferenceInSeconds(user.updatedAt) / 3600
            )} hour.`
          );
        } else if (
          user.otp_count <= 5 &&
          getTimeDifferenceInSeconds(user.updatedAt) < 30
        ) {
          res.status(400);
          throw new Error("Unable to send OTP");
        } else {
          const otp = generate6DigitOTP();

          user.otp = otp;
          user.otp_count = user.otp_count + 1;
          await user.save();
          const subject = "Password Reset";
          const text = `OTP.`;

          const html = `<p>Dear ${user.name},</p><p>Thank you for registering with Choose Your Therapist.
                </p><p>Use the below OTP to verify your account
                </p><p>OTP - ${otp}</p>`;

          const isMailSent = await sendMail(user.email, subject, text, html);
          let is_mail_sent = isMailSent ? 1 : 0;
          if (is_mail_sent) {
            res.status(201).json({
              message: "Otp has been sent to your mail id",
              data: {},
              status: true,
            });
          } else {
            throw new Error("Unable to send OTP");
          }
        }
      } else {
        res.status(200).json({
          message: "This email id is not registered with us",
          status: false,
          data: {},
        });
      }
    } catch (err) {
      return next(new Error(err.message));
    }
  }
);

export const verifyOtp = expressAsyncHandler(async (req, res, next) => {
  const validateSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string()
      .length(6)
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        "string.pattern.base": "Please enter valid otp",
      }),
  });
  const { error } = validateSchema.validate(req.body);

  if (error) {
    return next(error);
  }
  let email = req.body.email.toLowerCase();
  let otp = req.body.otp;
  try {
    const user = await Users.findOne({ email });
    if (user) {
      if (user.otp === otp) {
        user.otp = "";
        user.otp_count = 0;
        await user.save();

        res.status(201).json({
          message: "Otp verified successfully",
          data: user,
          status: true,
          token: generateToken(user._id, user.role),
        });
      } else {
        res.status(400);
        return next(new Error("Invalid OTP"));
      }
    } else {
      res.status(400);
      return next(new Error("No user found with this email."));
    }
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});

export const verifyOtpAndResetPassword = expressAsyncHandler(
  async (req, res, next) => {
    const complexityOptions = {
      min: 6,
      max: 250,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 1,
      requirementCount: 2,
    };
    const validateSchema = Joi.object({
      password: passwordComplexity(complexityOptions).required().messages({
        "password.minOfUppercase":
          "{#label} should contain at least {#min} uppercase character",
        "password.minOfSpecialCharacters":
          "{#label} should contain at least {#min} special character",
        "password.minOfLowercase":
          "{#label} should contain at least {#min} lowercase character",
        "password.minOfNumeric":
          "{#label} should contain at least {#min} numeric character",
        "password.noWhiteSpaces": "{#label} should not contain white spaces",
      }),
      email: Joi.string().email().required(),
      otp: Joi.string()
        .length(6)
        .pattern(/^[0-9]+$/)
        .required()
        .messages({
          "string.pattern.base": "Please enter valid otp",
        }),
    });
    const { error } = validateSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    let email = req.body.email.toLowerCase();
    let { password, otp } = req.body;
    // password = crypto.randomBytes(8).toString("hex");
    try {
      const user = await Users.findOne({ email });
      if (user) {
        if (user.otp == otp) {
          user.otp = "";
          user.otp_count = 0;
          user.password = password;
          await user.save();
          res.status(201).json({
            message: "Password changed successfully.You may login now.",
            data: {},
            status: true,
          });
        } else {
          res.status(400);
          return next(new Error("Invalid OTP"));
        }
      } else {
        res.status(201).json({
          message: "No such user found with this email.",
          data: {},
          status: false,
        });
      }
    } catch (err) {
      res.status(400);
      throw new Error(err.message);
    }
  }
);

export const login = expressAsyncHandler(async (req, res, next) => {
  try {
    let { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required!", status: false });
    }

    email = email.toLowerCase();
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User does not exist", status: false });
    }

    // Check if admin but not verified
    if (user.role === 1 && user.is_verified === 0) {
      return res.status(403).json({ message: "This email id is not activated yet", status: false });
    }

    const now = Date.now();
    const timeDiffSec = getTimeDifferenceInSeconds(user.updatedAt);
    const otp = generate6DigitOTP();

    // OTP limits
    if (user.otp_count >= 5 && timeDiffSec < 3600) {
      const hours = Math.ceil((3600 - timeDiffSec) / 3600);
      return res.status(429).json({
        message: `Can't send OTP! Maximum limit exceeded. Please try after ${hours} hour(s).`,
        status: false,
      });
    }

    if (user.otp_count <= 5 && timeDiffSec < 30) {
      return res.status(429).json({ message: "Unable to send OTP. Try again later.", status: false });
    }

    user.otp = otp;
    user.otp_count = (user.otp_count || 0) + 1;
    await user.save();

    // Send mail
    const subject = "Welcome Again";
    const text = `Hello, thank you for coming again. Best regards, CYT`;
    const html = `
      <p>Hello ${user.name},</p>
      <p>Please use the following one-time password to validate your login:</p>
      <h2>OTP - ${otp}</h2>
    `;

    await sendMail(email, subject, text, html);

    return res.status(201).json({
      message: "OTP has been sent to your email",
      status: true,
      data: {},
    });
  } catch (err) {
    return next(err); // let your global error handler handle this
  }
});



export const adminLogin = expressAsyncHandler(async (req, res) => {
  const { password } = req.body;
  let email = req.body.email.toLowerCase();
  const admin = await Admin.findOne({ email });

  if (admin) {
    admin.comparePassword(password).then((isMatched) => {
      if (isMatched) {
        res.status(200).json({
          message: "Login successfully",
          status: true,
          data: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            profile: admin.profile,
            designation: admin.designation,
            token: generateToken(admin._id),
          },
        });
      } else {
        return res.status(200).json({
          message: "Invalid email or password",
          status: false,
        });
      }
    });
  } else {
    res.status(400);
    throw new Error("Failed to login");
  }
});

export const changePassword = expressAsyncHandler(async (req, res, next) => {
  const complexityOptions = {
    min: 6,
    max: 250,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 2,
  };
  const validateSchema = Joi.object({
    password: Joi.string().required().messages({
      "string.empty": "Password cannot be empty",
    }),
    npassword: passwordComplexity(complexityOptions).required().messages({
      "password.minOfUppercase":
        "{#label} should contain at least {#min} uppercase character",
      "password.minOfSpecialCharacters":
        "{#label} should contain at least {#min} special character",
      "password.minOfLowercase":
        "{#label} should contain at least {#min} lowercase character",
      "password.minOfNumeric":
        "{#label} should contain at least {#min} numeric character",
      "password.noWhiteSpaces": "{#label} should not contain white spaces",
    }),
    cpassword: Joi.string().valid(Joi.ref("npassword")).required().messages({
      "string.empty": "Confirm Password cannot be empty",
      "any.only": "Confirm Password does not match New Password",
    }),
  });
  const { error } = validateSchema.validate(req.body);

  if (error) {
    return next(error);
  }

  let { password, npassword } = req.body;
  try {
    const userExists = await Users.findById(req.user._id);

    if (!userExists) {
      res.status(400);
      return next(new Error("This user is not exists"));
    }
    userExists.comparePassword(password).then(async (isMatched) => {
      if (isMatched) {
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(npassword, salt);
        await Users.findByIdAndUpdate(
          userExists._id,
          { password },
          { new: true }
        );
        res.status(200).json({
          message: "Password has been changes successfully",
          status: true,
          data: {},
        });
      } else {
        res.status(400);
        return next(new Error("Invalid Current password"));
      }
    });
  } catch (error) {
    res.status(400);
    return next(new Error(error));
  }
});
