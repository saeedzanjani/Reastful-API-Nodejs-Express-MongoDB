const nodeMailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

const transporterDetails = smtpTransport({
    host: "ssaeed.ssszzz@gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "ssaeed.ssszzz@gmail.com",
        pass: "Saeed",
    },
    tls: {
        rejectUnauthorized: false,
    },
});

exports.sendEmail = (email, fullname, subject, message) => {
    const transporter = nodeMailer.createTransport(transporterDetails);
    transporter.sendMail({
        from: "ssaeed.ssszzz@gmail.com",
        to: email,
        subject: subject,
        html: `<h1> سلام ${fullname}</h1>
            <p>${message}</p>`,
    });
};
