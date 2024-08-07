import User from '@/models/userModel';
import nodemailer from 'nodemailer'
import bcryptjs from 'bcryptjs'

export const sendEmail = async ({email, emailType, userId}:any) => {
    try {

      const hashedToken = await bcryptjs.hash(userId.toString(), 10)

      if (emailType === 'VERIFY') {
        await User.findByIdAndUpdate(userId, {
          verifyToken: hashedToken,
          verifyTokenExpires: Date.now() + 3600000,
        })
      } else if(emailType === 'RESET') {
        await User.findByIdAndUpdate(userId, {
          forgetPasswordToken: hashedToken,
          forgetPasswordTokenExpires: Date.now() + 3600000,
        })
      }
      
      const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PASS
        }
      });
    
          const mailOptions = {
            from: "himanshu@hk.com",
            to: email,
            subject: emailType === 'VERIFY' ? 'verify your email' : 'reset your password',
            text: "Hello world?",
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`,
          }
    
          const mailResponse = await transport.sendMail(mailOptions)
          return mailResponse
    } catch (error:any) {
        throw new Error(error.message)
    }
}