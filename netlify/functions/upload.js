import Busboy from "busboy";
import nodemailer from "nodemailer";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  return new Promise((resolve) => {
    const busboy = new Busboy({
      headers: event.headers,
      limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
    });

    let fileBuffer = [];
    let fileName = "";
    let mimeType = "";

    busboy.on("file", (_, file, info) => {
      fileName = info.filename;
      mimeType = info.mimeType;

      file.on("data", (data) => fileBuffer.push(data));
    });

    busboy.on("finish", async () => {
      try {
        const buffer = Buffer.concat(fileBuffer);

        // Nodemailer mit Mailgun
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtp.mailgun.org",
          port: 587,
          secure: false, // STARTTLS
          auth: {
            user: process.env.SMTP_USER || "test@sandbox7a2774f2ba4f4177923607fa4fe95442.mailgun.org",
            pass: process.env.SMTP_PASS || "469b8b482474d36b36d78edf6fcd29bc-ac8ca900-5492e346"
          }
        });

        await transporter.sendMail({
          from: process.env.MAIL_FROM || "test@sandbox7a2774f2ba4f4177923607fa4fe95442.mailgun.org",
          to: process.env.MAIL_TO || "deine.empfaenger@mail.de",
          subject: "Upload von GitHub Page",
          text: "Ein Bild wurde hochgeladen.",
          attachments: [{
            filename: fileName,
            content: buffer,
            contentType: mimeType
          }]
        });

        resolve({ statusCode: 200, body: "OK" });

      } catch (err) {
        console.error(err);
        resolve({ statusCode: 500, body: "Mail error" });
      }
    });

    // Busboy erwartet ein Buffer-Objekt
    const bodyBuffer = Buffer.from(event.body, event.isBase64Encoded ? "base64" : "utf8");
    busboy.end(bodyBuffer);
  });
};
