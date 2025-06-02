import nodemailer from "nodemailer";

// Configure the transporter with Namecheap SMTP settings
const transporter = nodemailer.createTransport({
  host: "chooseyourtherapist.in", // Namecheap SMTP server
  port: 465, // SMTP port (typically 465 for secure connection)
  secure: true, // true for 465, false for other ports
  auth: {
    user: "no-reply@chooseyourtherapist.in", // Your Namecheap email address
    pass: "Cyt&7697deepak", // Your Namecheap email password
  },
});

// Function to send an email
export const sendMail = async (to, subject, text, html) => {
  try {
    await transporter.sendMail({
      from: '"ChooseYourTherapist" no-reply@chooseyourtherapist.in', // Sender address
      to: to, // List of receivers
      subject: subject, // Subject line
      text: text, // Plain text body
      html: html, // HTML body
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
