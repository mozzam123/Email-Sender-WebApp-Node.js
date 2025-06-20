const express = require("express");
const app = express();
const multer = require("multer");
const dotenv = require("dotenv")
const path = require("path");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const User = require("./models/User");
const Email = require("./models/Email");
dotenv.config()


console.log("Mongo uri***********: ",process.env.MONGODB_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Multer setup for file uploads
const storage = multer.memoryStorage(); // Using memory storage, you can change it as needed
const upload = multer({ storage: storage });


// Set view engine and template path
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// Rendering the home page
app.get("/", (req, res) => {
  res.render("home");
});

// Handling the form submission
app.post("/send-email", upload.single("attachment"), async (req, res) => {
  const sender = req.body.sender;
  const recipient = req.body.recipient.trim();
  const subject = req.body.subject;
  const body = req.body.body;
  const attachment = req.file;

  try {
    // Find or create user
    let user = await User.findOne({ email: sender });
    if (!user) {
      user = await User.create({ email: sender });
    }

    // Check if email was already sent to this recipient by this user
    const existingEmail = await Email.findOne({
      sender,
      recipient,
      sentBy: user._id
    });

    if (existingEmail) {
      return res.json({ 
        error: true, 
        message: "You have already sent an email to this recipient"
      });
    }

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Configure email options
    const mailOptions = {
      from: sender,
      to: recipient,
      subject: subject,
      text: body,
      attachments: attachment ? [{ filename: attachment.originalname, content: attachment.buffer }] : []
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Save email record
    const emailRecord = await Email.create({
      sender,
      recipient,
      subject,
      body,
      attachmentName: attachment ? attachment.originalname : null,
      sentBy: user._id
    });

    // Update user's sent emails
    user.sentEmails.push(emailRecord._id);
    await user.save();

    // Send success response
    res.json({ 
      success: true, 
      message: "Email sent successfully!" 
    });

  } catch (error) {
    console.error("Error sending email:", error);
    res.json({ 
      error: true, 
      message: error.message 
    });
  }
});

module.exports = app;
