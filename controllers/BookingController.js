import expressAsyncHandler from "express-async-handler";
import Joi from "joi";
import Booking from "../models/Booking.js";
import mongoose from "mongoose";
import Therapists from "../models/Therapists.js";
import { generate6DigitOTP, generateQrCode } from "../helper/generate.js";
import UPIInfo from "../models/UPIInfo.js";
import UserInfo from "../models/UserInfo.js";
import { isValidEmail } from "../helper/isValidMail.js";
import Users from "../models/Users.js";
import { sendMail } from "../helper/mailer.js";
import { getTimeDifferenceInSeconds } from "../helper/time.js";
export const bookTherapist = expressAsyncHandler(async (req, res, next) => {
  const validateSchema = Joi.object({
    phone: Joi.string().required().messages({
      "string.base": "Phone number must be a string",
      "string.empty": "Phone number is required",
      "any.required": "Phone number is required",
    }),
    service: Joi.string().required().messages({
      "string.base": "Service must be a string",
      "string.empty": "Service is required",
      "any.required": "Service is required",
    }),
    format: Joi.string().required().messages({
      "string.base": "Format must be a string",
      "string.empty": "Format is required",
      "any.required": "Format is required",
    }),
    whom: Joi.string().valid("For Other", "Self").required().messages({
      "string.base": "Whom must be a string",
      "string.empty": "Whom is required",
      "any.required": "Whom is required",
      "any.only": 'Whom must be one of "For Other" or "Self"',
    }),
    amount: Joi.number().min(0).required().messages({
      "number.base": "Amount must be a number",
      "number.min": "Amount must be greater than or equal to 0",
      "any.required": "Amount is required",
    }),
  }).unknown(true);

  const { error } = validateSchema.validate(req.body);

  if (error) {
    res.status(400);
    return next(new Error(error));
  }

  try {
    const {
      phone,
      service,
      format,
      whom,
      cname,
      realtion_with_client,
      age,
      amount,
      notes,
      therapist,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(therapist)) {
      res.status(400);
      return next(new Error("Therapist Not Exist."));
    }

    const isExist = await Therapists.findById(therapist);

    if (isExist) {
      let client = req.user._id;
      let otp = generate6DigitOTP();
      const booked = await Booking.create({
        therapist,
        client,
        phone,
        service,
        format,
        whom,
        cname,
        realtion_with_client,
        age,
        notes,
        amount,
        otp,
      });
      if (booked) {
        res.status(201).json({
          status: true,
          message: "Booking saved successfully.",
          data: {
            id: booked._id,
          },
        });
      } else {
        res.status(400);
        return next(new Error("Failed to checkout."));
      }
    } else {
      res.status(400);
      return next(new Error("Error finding therapist."));
    }
  } catch (err) {
    return next(new Error(err.message));
  }
});

export const bookTherapistAnomalously = expressAsyncHandler(async (req, res, next) => {
  const validateSchema = Joi.object({
    phone: Joi.string().required().messages({
      "string.base": "Phone number must be a string",
      "string.empty": "Phone number is required",
      "any.required": "Phone number is required",
    }),
    email: Joi.string().email().required().messages({
      "string.base": "Email must be a string",
      "string.email": "Email must be a valid email address",
      "string.empty": "Email is required",
      "any.required": "Email is required",
    }),
    service: Joi.string().required().messages({
      "string.base": "Service must be a string",
      "string.empty": "Service is required",
      "any.required": "Service is required",
    }),
    format: Joi.string().required().messages({
      "string.base": "Format must be a string",
      "string.empty": "Format is required",
      "any.required": "Format is required",
    }),
    whom: Joi.string().valid("For Other", "Self").required().messages({
      "string.base": "Whom must be a string",
      "string.empty": "Whom is required",
      "any.required": "Whom is required",
      "any.only": 'Whom must be one of "For Other" or "Self"',
    }),
    amount: Joi.number().min(0).required().messages({
      "number.base": "Amount must be a number",
      "number.min": "Amount must be greater than or equal to 0",
      "any.required": "Amount is required",
    }),
  }).unknown(true);


  const { error } = validateSchema.validate(req.body);

  if (error) {
    res.status(400);
    return next(new Error(error));
  }

  try {
    const {
      name,
      phone,
      service,
      format,
      whom,
      cname,
      realtion_with_client,
      age,
      amount,
      notes,
      isLoggedIn,
      therapist,
    } = req.body;

    let email = req.body.email;

    if (!isLoggedIn && !isValidEmail(email)) {
      res.status(400);
      return next(new Error("Eamil is not valid."));
    }

    if (!mongoose.Types.ObjectId.isValid(therapist)) {
      res.status(400);
      return next(new Error("Therapist Not Exist."));
    }

    const isExist = await Therapists.findById(therapist);

    if (isExist) {
      email = email.toLowerCase();

      const therapistExists = await Therapists.findOne({ email });

      if (therapistExists) {
        res.status(400);
        return next(new Error("This email is associated with a therapist! Please enter another mail id!"));
      }

      let user = await Users.findOne({ email });
      let generatedOtp = generate6DigitOTP();
      const subject = "Welcome to CYT";
      const text = `Hello Thank you for registering.Best regards,CYT`;

      const html = `<p>Hello ${name},</p><p>Thank you for registering.</p><p>Use the below otp to verify account</p><p>Otp:${generatedOtp}</p>`;

      if (user) {
        if (user.is_verified === 1) {
          res.status(400);
          throw new Error("This user is already registred with us");
        } else if (
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
          user.otp = generatedOtp;
          user.otp_count = user.otp_count + 1;
          await user.save();
          await sendMail(email, subject, text, html);
          // res.status(201).json({
          //   message: "Otp has been sent to your mail id",
          //   data: {},
          //   status: true,
          // });
        }
      } else {
        let otp_count = 1;
        await sendMail(email, subject, text, html);
        user = await Users.create({
          name,
          email,
          phone,
          otp: generatedOtp,
          otp_count,
        });
      }
      let client = user._id;
      let otp = generate6DigitOTP();
      const booked = await Booking.create({
        therapist,
        client,
        phone,
        service,
        format,
        whom,
        cname,
        realtion_with_client,
        age,
        notes,
        amount,
        otp,
      });
      if (booked) {
        res.status(201).json({
          status: true,
          message: "Booking saved successfully.",
          data: {
            id: booked._id,
          },
        });
      } else {
        res.status(400);
        return next(new Error("Failed to checkout."));
      }
    } else {
      res.status(400);
      return next(new Error("Error finding therapist."));
    }
  } catch (err) {
    return next(new Error(err.message));
  }
});

export const generatePaymentQR = expressAsyncHandler(async (req, res, next) => {
  const bookingId = req.params.id;
  if (!bookingId) {
    res.status(400);
    return next(new Error("Please pass booking ID"));
  }
  try {
    const getUpi = await UPIInfo.findOne();

    if (!getUpi) {
      res.status(400);
      return next(new Error("Id Not found!"));
    }
    const isBookingDetail = await Booking.findById(bookingId);
    if (!isBookingDetail) {
      res.status(400);
      return next(new Error("booking not found with this id"));
    }
    if (isBookingDetail.is_payment_success) {
      return res.status(400).json({
        message: "Booking amount already received for this id",
        status: false,
      });
    }
    const data = {
      upiID: getUpi.upi_id,
      name: getUpi.name,
      amount: isBookingDetail.amount,
      note: "Booking Therapist",
    };

    const qrImage = await generateQrCode(data);
    const retrunData = {
      qrImage,
      upi_details: getUpi,
      booking_id: isBookingDetail._id,
    };
    res.status(201).json({
      status: true,
      message: "Profile has been updated.",
      data: retrunData,
    });
  } catch (err) {
    return next(new Error(err.message));
  }
});

export const saveTransactionId = expressAsyncHandler(async (req, res, next) => {
  const validateSchema = Joi.object({
    transactionId: Joi.string().required().messages({
      "string.base": "Transaction ID must be a string",
      "string.empty": "Transaction ID is required",
      "any.required": "Transaction ID is required",
    }),

    booking_id: Joi.string().required().messages({
      "string.base": "Booking ID must be a string",
      "string.empty": "Booking ID is required",
      "any.required": "Booking ID is required",
    }),
  }).unknown(true);

  const { error } = validateSchema.validate(req.body);

  if (error) {
    res.status(400);
    return next(new Error(error));
  }

  try {
    const { transactionId, booking_id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(booking_id)) {
      res.status(400);
      return next(new Error("Booking invalid."));
    }

    const isExist = await Booking.findById(booking_id);

    if (isExist) {
      isExist.transaction = transactionId;
      isExist.save();
      res.status(201).json({
        status: true,
        message: "Transaction successful.",
        data: isExist,
      });
    } else {
      res.status(400);
      return next(new Error("Error finding booking."));
    }
  } catch (err) {
    return next(new Error(err.message));
  }
});

export const getBookings = expressAsyncHandler(async (req, res, next) => {
  try {
    let result = await Booking.find({ clinet: req.user._id })
      .populate({
        path: "client",
        select: "name email mobile",
      })
      .populate({
        path: "therapist",
        select: "_id name profile",
      })
      .exec();
    const user = await UserInfo.findById(req.user._id);
    const data = result.map((booking) => {
      return {
        ...booking.toObject(),
        user_age: user?.age || null,
      };
    });

    res.status(201).json({
      status: true,
      message: "Fetched successfully.",
      data: data || [],
    });
  } catch (err) {
    return next(new Error(err.message));
  }
});
