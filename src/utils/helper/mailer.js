import nodemailer from "nodemailer";
import User from "@/models/userModels";
import bcrypt from "bcrypt";

export const sendEmail = async ({ email, emailType, userId }) => {
  try {
    // Token generate karna aur bcrypt ke saath hash karna
    const hashedToken = await bcrypt.hash(userId.toString(), 10);

    // Token aur expiry ko user model mein save karna
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000, // 1 hour expiry
      });
    }

    // Nodemailer ke liye transporter setup
    // Looking to send emails in production? Check out our Email API/SMTP product!
    var transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "79210872e195c7",
        pass: "17ffbfa1684800",
      },
    });

    // Email ke options
    const mailOptions = {
      from: "your-email@example.com", // Sender email
      to: email, // Receiver email
      subject:
        emailType === "VERIFY" ? "Verify Your Email" : "Reset Your Password",
      html: `
        <p>Click <a href="${process.env.DOMAIN}/${
        emailType === "VERIFY" ? "verifyemail" : "resetpassword"
      }?token=${hashedToken}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      }.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    // Email bhejna
    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
  } catch (error) {
    throw new Error(error.message); // Agar koi error aaye to handle karna
  }
};
