import Busboy from "busboy";
import nodemailer from "nodemailer";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405 };
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

        // Mail-Transport
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: 587,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });

        await transporter.sendMail({
          from: process.env.MAIL_FROM,
          to: process.env.MAIL_TO,
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
        resolve({ statusCode: 500, body: "Mail error" });
      }
    });

    busboy.end(Buffer.from(event.body, "base64"));
  });
};

