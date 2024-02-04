const express = require("express");
const app = express();
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

// Parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Multer setup for file uploads
const storage = multer.memoryStorage(); // Using memory storage, you can change it as needed
const upload = multer({ storage: storage });

// Serve static files from the public directory
// app.use(express.static(path.join(__dirname   , "/src/public")));

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
  const recipient = req.body.recipient;
  const subject = req.body.subject;
  const body = req.body.body;

  // Access the uploaded file
  const attachment = req.file;

  // Configure nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mozzam607@gmail.com', // Your Gmail email address
      pass: 'ckcy adna arxr glbm' // Your Gmail password or app-specific password
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

  try {
    // Send email
    await transporter.sendMail(mailOptions);

    // Log values for testing
    console.log("Email sent successfully!");
    console.log("Sender:", sender);
    console.log("Recipient:", recipient);
    console.log("Subject:", subject);
    console.log("Body:", body);

    if (attachment) {
      console.log("Attachment:", attachment.originalname);
    }

    // Redirect or send response as needed
    res.send("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email");
  }
});

module.exports = app;
