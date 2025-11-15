const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send email function
const sendEmail = async ({ to, subject, body, from }) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: from || process.env.EMAIL_FROM,
      to: to,
      subject: subject,
      text: body,
      html: body.replace(/\n/g, '<br>'), // Convert newlines to HTML
    };

    const info = await transporter.sendMail(mailOptions);
    
    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Verify email configuration
const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('Email service is ready to send emails');
    return true;
  } catch (error) {
    console.error('Email service configuration error:', error.message);
    return false;
  }
};

module.exports = {
  sendEmail,
  verifyEmailConfig,
};
