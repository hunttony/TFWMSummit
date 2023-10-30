const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
const port = 3000;

// Middleware to parse JSON data
app.use(express.json());

// Serve the HTML form
app.use(express.static("public"));

// POST endpoint to send emails
app.post("/send-email", (req, res) => {
    const { email, subject, message } = req.body;

    // Create a Nodemailer transporter with your SMTP settings
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "ahunt3542@gmail.com",
            pass: "TummyD3$k.34"
        }
    });

    const mailOptions = {
        from: "info@event.com",
        to: email,
        subject: subject,
        text: message
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
            res.status(500).json({ error: "An error occurred while sending the email." });
        } else {
            console.log("Email sent:", info.response);
            res.status(200).json({ message: "Email sent successfully!" });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
