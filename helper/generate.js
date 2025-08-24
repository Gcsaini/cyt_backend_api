import crypto from "crypto";
import QRCode from "qrcode";
export const generate6DigitOTP = () => {
  const otp = crypto.randomInt(100000, 1000000);
  return otp;
};

export const generateQrCode = async (data) => {
  const upiUrl = `upi://pay?pa=${data.upiID}&pn=${encodeURIComponent(
    data.name
  )}&am=${data.amount}&cu=INR&tn=${encodeURIComponent(data.note)}`;
  const qrImage = await QRCode.toDataURL(upiUrl);

  return qrImage;
};
