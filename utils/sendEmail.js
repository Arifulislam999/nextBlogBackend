const nodemainer = require("nodemailer");
const sendEmail = async (subject, message, send_to, send_form, replay_to) => {
  const transporter = nodemainer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const options = {
    from: send_form,
    to: send_to,
    replayTo: replay_to,
    subject: subject,
    html: message,
  };
  //   send email
  transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};
module.exports = sendEmail;
