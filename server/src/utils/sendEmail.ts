import nodemailer from 'nodemailer';

/**
 * Sends an email using the SMTP settings defined in .env
 * @param reveiver_mail - The recipient's email address
 * @param subject - The subject line of the email
 * @param body - The plain text content or HTML content
 */
const sendEmail = async (
  reveiver_mail: string, 
  subject: string, 
  body: string
): Promise<void> => {
  
  // Create the transporter using your .env variables
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Configure the email data
  const mailOptions = {
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to: reveiver_mail,
    subject: subject,
    text: body, // For plain text
    html: body, // This allows you to pass HTML strings if needed
  };

  // Send the actual email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;