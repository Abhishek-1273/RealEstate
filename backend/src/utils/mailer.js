import nodemailer from 'nodemailer';

/**
 * Sends an email using SMTP if configured in .env, otherwise logs to the console.
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Subject of email
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML markup content
 */
export const sendEmail = async ({ to, subject, text, html }) => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT) || 587,
        secure: Number(SMTP_PORT) === 465,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
        connectionTimeout: 5000, // 5 seconds
        greetingTimeout: 5000,   // 5 seconds
        socketTimeout: 5000,     // 5 seconds
      });

      const info = await transporter.sendMail({
        from: SMTP_FROM || '"HyperRelestix" <noreply@hyperrelestix.com>',
        to,
        subject,
        text,
        html,
      });

      console.info(`✉️ Email sent successfully to ${to}. Message ID: ${info.messageId}`);
      return true;
    } catch (err) {
      console.error(`❌ Email sending to ${to} failed:`, err.message);
    }
  }

  // Development Fallback: output to console
  console.info('\n' + '═'.repeat(60));
  console.info(`📧 [MOCKED EMAIL DELIVERY] To: ${to}`);
  console.info(`📝 Subject: ${subject}`);
  console.info(`💬 Message: ${text}`);
  console.info('═'.repeat(60) + '\n');
  return false;
};
