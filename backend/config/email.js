const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendPaymentConfirmation = async (userEmail, userName, paymentDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Payment Confirmation - FinDoorz',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1f2937;">Payment Confirmation</h2>
        <p>Dear ${userName},</p>
        <p>Your payment has been successfully processed.</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151;">Payment Details:</h3>
          <p><strong>Transaction ID:</strong> ${paymentDetails.transactionId}</p>
          <p><strong>Amount:</strong> ₹${paymentDetails.amount}</p>
          <p><strong>Date:</strong> ${new Date(paymentDetails.createdAt).toLocaleDateString()}</p>
          <p><strong>Status:</strong> ${paymentDetails.paymentStatus}</p>
        </div>
        
        <p>Thank you for using FinDoorz!</p>
        <p>If you have any questions, please contact our support team.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Payment confirmation email sent');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = {
  sendPaymentConfirmation
}; 