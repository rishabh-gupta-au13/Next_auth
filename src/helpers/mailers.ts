import User from '@/models/userModel';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';





export const sendEmail = async ({ email, emailType, userId }: any) => {







  try {

    const hashtoken = await bcrypt.hash(userId.toString(), 10)


    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId,
        {
          verifyToken: hashtoken,
          verifyTokenExpiry: Date.now() + 3600000

        })

    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId,
        {
          forgotPasswordToken: hashtoken,
          forgotPasswordTokenExpiry: Date.now() + 3600000

        })

    }


    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "b43950a7e43225",
        pass: "c7b36c3ccb0171"
      }
    });

    const mailOptions = {
      from: '', // sender address
      to: email, // list of receivers
      subject: emailType === 'VERIFY' ? "Verify Your Email" : "Reset Your Paassword", // Subject line
      // text: "Hello world?", // plain text body
      html: `<p>Click<a href="${process.env.DOMAIN}/verifyemail?token=${hashtoken}">here</a> to ${emailType === "VERIFY" ? "Verify your email" : "Reset your password"}
            or copy and paste the link below in your browser.
            <br>${process.env.DOMAIN}/verifyemail?token=${hashtoken}
            </p>`, // html body
    };

    const mailResponse: any = await transporter.sendMail(mailOptions);
    return mailResponse

  } catch (error: any) {
    throw new Error(error.message)

  }

}