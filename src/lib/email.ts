import nodemailer from 'nodemailer';

const host = process.env.EMAIL_SERVER_HOST;
const port = Number(process.env.EMAIL_SERVER_PORT);
const user = process.env.EMAIL_SERVER_USER;
const pass = process.env.EMAIL_SERVER_PASSWORD;
const from = process.env.EMAIL_FROM;

// We create a "transporter" object that knows how to connect to our email service
const transporter = nodemailer.createTransport({
  host: host,
  port: port,
  secure: false, // true for 465, false for other ports
  auth: {
    user: user,
    pass: pass,
  },
});

// This is our reusable function to send emails
export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  try {
    const info = await transporter.sendMail({
      from: `SkillSwap <${from}>`, 
      to: to,
      subject: subject,
      html: html,
    });

    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email: ", error);
    throw new Error("Could not send email.");
  }
}