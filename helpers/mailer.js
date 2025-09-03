import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
          user: 'therajeevkumargupta@gmail.com',
          pass: process.env.EMAIL_PASSWORD
     }
});

const sendMail = async (email, subject, content) => {
     try {
          const mailOptions = {
               from: 'therajeevkumargupta@gmail.com',
               to: email,
               subject: subject,
               html: content
          };
          await transporter.sendMail(mailOptions, (error) => {
               if (error) {
                    console.log(`Error Sending mail`);
               } else {
                    console.log(`Mail sent successfully`);
               }
          });
     } catch (error) {
          console.log(error);
     }
};

export default sendMail;