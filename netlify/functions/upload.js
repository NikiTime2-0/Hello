import busboy from "busboy";
import nodemailer from "nodemailer";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

export const handler = async (event) => {

  // CORS Preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders
    };
  }

  return new Promise((resolve) => {

    const bb = busboy({
      headers: event.headers,
      limits: { fileSize: 5 * 1024 * 1024 }
    });

    let fileBuffer = [];
    let fileName = "";
    let mimeType = "";

    bb.on("file", (name, file, info) => {
      fileName = info.filename;
      mimeType = info.mimeType;

      file.on("data", (data) => fileBuffer.push(data));
    });

    bb.on("finish", async () => {
      try {
        const buffer = Buffer.concat(fileBuffer);

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

        resolve({
          statusCode: 200,
          headers: corsHeaders,
          body: "OK"
        });

      } catch (err) {
        console.error(err);
        resolve({
          statusCode: 500,
          headers: corsHeaders,
          body: "Mail error"
        });
      }
    });

    bb.end(Buffer.from(event.body, "base64"));
  });
};
