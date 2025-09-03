import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
     service: "gmail",
     auth: {
          user: "therajeevkumargupta@gmail.com",
          pass: process.env.EMAIL_PASSWORD
     }
});

const sendMail = async (email, subject, content) => {
     try {
          const mailOptions = {
               from: "therajeevkumargupta@gmail.com",
               to: email,
               subject,
               html: content
          };
          await transporter.sendMail(mailOptions);
          console.log("Mail sent successfully");
     } catch (error) {
          console.log("Error sending mail:", error);
     }
};

export default sendMail;