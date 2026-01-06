const Busboy = require("busboy");
const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  return new Promise((resolve) => {
    const bb = Busboy({
      headers: event.headers,
      limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
    });

    let fileBuffer = [];
    let fileName = "";
    let mimeType = "";

    bb.on("file", (_, file, info) => {
      fileName = info.filename;
      mimeType = info.mimeType;

      file.on("data", (data) => fileBuffer.push(data));
    });

    bb.on("finish", async () => {
      try {
        const buffer = Buffer.concat(fileBuffer);

        const transporter = nodemailer.createTransport({
          host: "smtp.mailgun.org",
          port: 587,
          secure: false,
          auth: {
            user: "test@sandbox7a2774f2ba4f4177923607fa4fe95442.mailgun.org",
            pass: "469b8b482474d36b36d78edf6fcd29bc-ac8ca900-5492e346"
          }
        });

        await transporter.sendMail({
          from: "test@sandbox7a2774f2ba4f4177923607fa4fe95442.mailgun.org",
          to: "DEINE_ZIELMAIL@DOMAIN.DE",
          subject: "Upload von GitHub Page",
          text: "Ein Bild wurde hochgeladen.",
          attachments: [
            {
              filename: fileName,
              content: buffer,
              contentType: mimeType
            }
          ]
        });

        resolve({ statusCode: 200, body: "OK" });
      } catch (err) {
        console.error(err);
        resolve({ statusCode: 500, body: "Mail error" });
      }
    });

    const body = Buffer.from(
      event.body,
      event.isBase64Encoded ? "base64" : "utf8"
    );

    bb.end(body);
  });
};
