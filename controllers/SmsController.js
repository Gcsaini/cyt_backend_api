import expressAsyncHandler from "express-async-handler";
import Joi from "joi";
import { generate6DigitOTP } from "../helper/generate.js";
import { createSnsClient } from "../services/AwsSns.js";
import { PublishCommand } from "@aws-sdk/client-sns";
export const SendOtp = expressAsyncHandler(async (req, res, next) => {
  const smsSchema = Joi.object({
    phone: Joi.string()
      .pattern(/^\d{10}$/)
      .required()
      .messages({
        "string.base": "Phone number should be a type of text",
        "string.empty": "Phone number cannot be an empty field",
        "string.pattern.base": "Phone number must be a 10-digit number",
        "any.required": "Phone number is a required field",
      }),
  });

  const { error } = smsSchema.validate(req.body);
  if (error) {
    return next(error);
  }

  try {
    let { phone } = req.body;

    const params = {
      Message: `Your OTP code is ${generate6DigitOTP()}`,
      PhoneNumber: `+91${phone}`, // Assuming the phone number is Indian and needs the country code
    };

    const snsClient = await createSnsClient();
    const command = new PublishCommand(params);
    const data = await snsClient.send(command);
    res
      .status(200)
      .send(`Message sent to ${phone} with MessageID: ${data.MessageId}`);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});
