import crypto from "crypto";
export const generate6DigitOTP = () => {
  const otp = crypto.randomInt(100000, 1000000);
  return otp;
};
