import expressAsyncHandler from "express-async-handler";
import Joi from "joi";
import Booking from "../models/Booking.js";
import mongoose from "mongoose";
import Therapists from "../models/Therapists.js";
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

    date: Joi.string().required().messages({
      "any.required": "Date is required",
    }),
    open_time: Joi.string().required().messages({
      "string.base": "Open time must be a string",
      "string.empty": "Open time is required",
      "any.required": "Open time is required",
    }),
    close_time: Joi.string().required().messages({
      "string.base": "Close time must be a string",
      "string.empty": "Close time is required",
      "any.required": "Close time is required",
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
      gender,
      dob,
      open_time,
      close_time,
      amount,
      therapist,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(therapist)) {
      res.status(400);
      return next(new Error("Therapist Not Exist."));
    }

    const isExist = await Therapists.findById(therapist);

    if (isExist) {
      let client = req.user._id;
      let date = new Date(req.body.date);
      const booked = await Booking.create({
        therapist,
        client,
        phone,
        service,
        format,
        whom,
        cname,
        realtion_with_client,
        gender,
        dob,
        date,
        open_time,
        close_time,
        amount,
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
    console.log("errorr", err);
    return next(new Error(err.message));
  }
});
