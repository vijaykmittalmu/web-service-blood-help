const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PWD,
    },
  });

  const mailOptions = {
    from: '"Blood help india" <bloodhelpindia@gmail.com>',
    to: options.email,
    subject: options.subject,
    html: options.message,
    //html: "<b>Hello world?</b>", // html body
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
