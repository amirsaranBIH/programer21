const nodemailer = require('nodemailer');
const config = require('config');

const HOST_URL = config.get('HOST_URL');
const HOST_PORT = config.get('HOST_PORT');

const SMTP_HOST = config.get('SMTP_HOST');
const SMTP_PORT = config.get('SMTP_PORT');
const SMTP_USER = config.get('SMTP_USER');
const SMTP_PASS = config.get('SMTP_PASS');

exports.sendMail = async (user, subject = 'No subject') => {
  let transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: (SMTP_PORT === 465),
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    },
    tls: {
      rejectUnauthorized: (process.env.NODE_ENV === 'production')
    }
  });

  let info = await transporter.sendMail({
    from: `Avika <${SMTP_USER}>`,
    to: user.email,
    subject: subject,
    text: `To verify account go to this link: ${HOST_URL}:${HOST_PORT}/api/verifyEmail/${user._id}/${user.verifyToken}`,
    html: `To verify account click link below<br><a href="${HOST_URL}:${HOST_PORT}/api/verifyEmail/${user._id}/${user.verifyToken}">Verify Account</a>`
  });

  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}