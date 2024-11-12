const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const Customer = require('../models/customers-models.js'); // Assuming Customer schema is imported


function createInvoicePDF(data) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    let buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });

    // Add content to the PDF
    doc.fontSize(20).text('Invoice', { align: 'center' }).moveDown();
    doc.fontSize(14).text(`Dear ${data.username},`, { align: 'left' }).moveDown();
    doc.fontSize(12).text('Here are your invoice details:', { align: 'left' }).moveDown();

    // Invoice details
    doc.text(`Amount: $${data.amount}`);
    doc.text(`Rental Days: ${data.rentalDays}`);
    doc.text(`Card Number: **** **** **** ${data.cardNumber.slice(-4)}`);
    doc.text(`Payment Date: ${data.paymentDate}`);
    doc.moveDown();

    doc.text('We hope to see you again!', { align: 'left' });
    doc.moveDown();
    doc.text('Best regards,', { align: 'left' });
    doc.text('SA Rental Car', { align: 'left' });

    // End the document
    doc.end();
  });
}


exports.sendInvoiceEmail = async (req, res) => {
  const { username, cardNumber, amount, rentalDays, paymentDate } = req.body;  // Include paymentDate

  try {
    // Fetch customer details from the database using username
    const customer = await Customer.findOne({ username });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const email = customer.email;

    // Prepare invoice data
    const invoiceData = {
      username,
      cardNumber,
      amount,
      rentalDays,
      paymentDate  // Include paymentDate in the invoice data
    };

    // Generate PDF
    const pdfBuffer = await createInvoicePDF(invoiceData);

    // Set up nodemailer transport
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use your email provider (Gmail, Outlook, etc.)
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS  // Your email password
      }
    });

    // Send email with PDF attachment
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your SA Rental Car Invoice',
      text: `Dear ${username},\n\nPlease find attached your invoice.\n\nAmount: $${amount}\nRental Days: ${rentalDays} days\nPayment Date: ${paymentDate}\n\nWe hope to see you again!\n\nBest regards,\nSA Rental Car`,  // Add paymentDate in the email body
      attachments: [
        {
          filename: `${username}_invoice.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Invoice sent via email successfully' });

  } catch (error) {
    console.error('Error sending invoice email:', error);
    res.status(500).json({ message: 'Failed to send invoice email', error: error.message });
  }
};
